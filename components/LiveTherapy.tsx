
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

// Helper functions for audio encoding/decoding as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveTherapy: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const startSession = async () => {
    setIsActive(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    // Setup contexts
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const outputNode = outAudioContextRef.current.createGain();
    outputNode.connect(outAudioContextRef.current.destination);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        systemInstruction: "You are Serenity Pro, a professional therapist. You can see the user and hear them. Respond with deep empathy, observe their facial expressions and tone, and guide them through their emotions. Maintain a professional yet warm therapeutic stance.",
      },
      callbacks: {
        onopen: () => {
          // Stream audio
          const source = audioContextRef.current!.createMediaStreamSource(stream);
          const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            if (isMuted) return;
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
            const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
            sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(audioContextRef.current!.destination);

          // Stream Video Frames
          const frameInterval = setInterval(() => {
            if (isVideoOff || !canvasRef.current || !videoRef.current) return;
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              canvasRef.current.width = 320;
              canvasRef.current.height = 240;
              ctx.drawImage(videoRef.current, 0, 0, 320, 240);
              const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.6);
              const base64Data = dataUrl.split(',')[1];
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64Data, mimeType: 'image/jpeg' } }));
            }
          }, 1000); // 1 FPS for efficiency
          (sessionRef.current as any).frameInterval = frameInterval;
        },
        onmessage: async (msg) => {
          const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData && outAudioContextRef.current) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outAudioContextRef.current.currentTime);
            const buffer = await decodeAudioData(decode(audioData), outAudioContextRef.current, 24000, 1);
            const source = outAudioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(outputNode);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }
          if (msg.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onclose: () => setIsActive(false),
        onerror: (e) => console.error("Live error", e)
      }
    });

    sessionRef.current = await sessionPromise;
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-brand text-slate-800">Serenity Pro Session</h2>
          <p className="text-slate-500">Full immersive AI therapy experience.</p>
        </div>
        {isActive && (
          <div className="flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-bold animate-pulse">
            <span className="w-2 h-2 bg-rose-600 rounded-full"></span> LIVE
          </div>
        )}
      </header>

      {!isActive ? (
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center p-12 text-center space-y-6">
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl">
            <i className="fa-solid fa-video"></i>
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-bold mb-2">Private Video Session</h3>
            <p className="text-slate-500 text-sm mb-8">
              Experience real-time support where the AI can observe your non-verbal cues and provide deeper guidance. Your stream is processed in real-time and never recorded.
            </p>
            <button 
              onClick={startSession}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-3 mx-auto"
            >
              <i className="fa-solid fa-phone"></i> Start Live Session
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid md:grid-cols-2 gap-6 min-h-[500px]">
          {/* AI Side */}
          <div className="bg-slate-900 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-32 h-32 bg-indigo-500 rounded-full flex items-center justify-center shadow-2xl mb-6 ring-4 ring-indigo-500/30 animate-pulse">
                <i className="fa-solid fa-leaf text-5xl text-white"></i>
              </div>
              <h4 className="text-white font-bold text-xl">Serenity Pro</h4>
              <p className="text-indigo-300 text-sm">Listening Attentively...</p>
            </div>
            
            {/* Visualizer Mock */}
            <div className="absolute bottom-12 flex gap-1 items-end h-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-1.5 bg-indigo-400 rounded-full animate-breathe" style={{ animationDelay: `${i * 0.1}s`, height: `${Math.random() * 100}%` }}></div>
              ))}
            </div>
          </div>

          {/* User Side */}
          <div className="bg-slate-200 rounded-3xl relative overflow-hidden shadow-inner">
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              className={`w-full h-full object-cover transform scale-x-[-1] ${isVideoOff ? 'hidden' : ''}`}
            />
            {isVideoOff && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400">
                <i className="fa-solid fa-video-slash text-5xl mb-4"></i>
                <p>Camera is Off</p>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all ${isMuted ? 'bg-rose-500 text-white' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/40'}`}
              >
                <i className={`fa-solid ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
              </button>
              <button 
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all ${isVideoOff ? 'bg-rose-500 text-white' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/40'}`}
              >
                <i className={`fa-solid ${isVideoOff ? 'fa-video-slash' : 'fa-video'}`}></i>
              </button>
              <button 
                onClick={stopSession}
                className="w-14 h-14 bg-rose-600 text-white rounded-full flex items-center justify-center text-xl hover:bg-rose-700 shadow-xl"
              >
                <i className="fa-solid fa-phone-slash"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTherapy;
