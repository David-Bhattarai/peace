
import React, { useState, useRef } from 'react';
import { analyzeBiometricState, BiometricProfile } from '../services/gemini';

const EmotionScanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [profile, setProfile] = useState<BiometricProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      setError("Please grant camera permissions to use the Neural Scanner.");
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    setError(null);

    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx?.drawImage(videoRef.current, 0, 0);
    
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
    setImage(dataUrl);
    
    // Stop camera tracks
    if (videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
    setIsCameraActive(false);

    try {
      // Calling the "Kada" Backend Logic
      const biometricData = await analyzeBiometricState(dataUrl.split(',')[1]);
      setProfile(biometricData);
    } catch (err) {
      setError("AI Engine Error: Could not resolve biometric patterns.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <header className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black tracking-widest uppercase mb-4">
          <i className="fa-solid fa-microchip"></i> Neural Core v2.5
        </div>
        <h2 className="text-5xl font-black font-brand text-slate-900 mb-3 tracking-tighter">Biometric Analysis</h2>
        <p className="text-slate-500">Scanning neural-facial patterns for emotional diagnostics.</p>
      </header>

      <div className="max-w-5xl mx-auto">
        {!image && !isCameraActive && (
          <div className="bg-white p-20 rounded-[3.5rem] border border-slate-200 flex flex-col items-center justify-center text-center shadow-2xl hover:border-indigo-400 transition-all group">
            <div className="w-28 h-28 bg-slate-900 text-white rounded-3xl flex items-center justify-center text-5xl mb-8 group-hover:rotate-12 transition-transform shadow-xl">
              <i className="fa-solid fa-face-viewfinder"></i>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Initialize Bio-Scan</h3>
            <p className="text-slate-500 mb-10 max-w-sm leading-relaxed">Our clinical-grade AI analyzes 42 facial muscle points to map your internal emotional landscape.</p>
            <button 
              onClick={startCamera}
              className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center gap-4 text-lg"
            >
              <i className="fa-solid fa-eye"></i> Open Lens
            </button>
          </div>
        )}

        {isCameraActive && (
          <div className="relative rounded-[3.5rem] overflow-hidden shadow-2xl bg-black aspect-video border-[16px] border-white ring-1 ring-slate-200">
            <video ref={videoRef} autoPlay className="w-full h-full object-cover transform scale-x-[-1]" />
            <div className="absolute inset-0 pointer-events-none p-12 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="bg-indigo-500 text-white px-3 py-1 rounded text-[10px] font-mono">NEURAL_STREAM: ACTIVE</div>
                <div className="bg-rose-500 text-white px-3 py-1 rounded text-[10px] font-mono animate-pulse">RECORDING_SAMPLES</div>
              </div>
              <div className="self-center w-72 h-72 border border-indigo-500/30 rounded-full flex items-center justify-center relative">
                 <div className="absolute inset-0 border-t-2 border-indigo-400 rounded-full animate-spin"></div>
                 <div className="w-64 h-64 border-2 border-dashed border-indigo-400/20 rounded-full"></div>
              </div>
              <div className="text-[10px] text-indigo-400 font-mono tracking-widest text-center">STABILIZING BIOMETRICS...</div>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-10 items-center">
              <button onClick={() => setIsCameraActive(false)} className="w-16 h-16 bg-white/10 backdrop-blur-2xl text-white rounded-full border border-white/20 hover:bg-rose-600 transition-all">
                <i className="fa-solid fa-xmark"></i>
              </button>
              <button 
                onClick={captureAndAnalyze}
                className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-2xl hover:scale-110 active:scale-95 transition-all group"
              >
                <div className="w-24 h-24 border-8 border-slate-900 rounded-full flex items-center justify-center group-hover:border-indigo-600 transition-colors">
                   <div className="w-14 h-14 bg-indigo-600 rounded-full shadow-inner"></div>
                </div>
              </button>
            </div>
          </div>
        )}

        {image && (
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-900 relative aspect-[4/5]">
                <img src={image} className={`w-full h-full object-cover ${isScanning ? 'opacity-40 grayscale' : 'opacity-80'}`} alt="Scan" />
                {isScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                     <div className="w-full h-1 bg-indigo-400 shadow-[0_0_30px_#818cf8] absolute animate-[scanning_1.2s_infinite]"></div>
                     <i className="fa-solid fa-brain text-6xl mb-6 text-indigo-400 animate-pulse"></i>
                     <h4 className="text-white font-black tracking-widest text-sm mb-2">EXTRACTING VECTORS</h4>
                     <p className="text-indigo-300 text-[10px] font-mono">MAPPING MICRO-EXPRESSIONS</p>
                  </div>
                )}
              </div>
              {!isScanning && (
                <button 
                  onClick={() => {setImage(null); setProfile(null); startCamera();}}
                  className="w-full py-5 bg-white text-slate-900 font-black rounded-3xl border-2 border-slate-100 hover:border-indigo-200 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <i className="fa-solid fa-rotate"></i> NEW DIAGNOSTIC
                </button>
              )}
            </div>

            <div className="lg:col-span-7 space-y-6">
              {isScanning ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 animate-pulse">
                      <div className="h-3 bg-slate-100 rounded-full w-1/4 mb-4"></div>
                      <div className="h-12 bg-slate-50 rounded-2xl w-full"></div>
                    </div>
                  ))}
                </div>
              ) : profile ? (
                <div className="space-y-6 animate-in slide-in-from-right-12 duration-1000">
                  {/* Result Card */}
                  <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-10">
                        <span className="px-4 py-1.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                          Neural Result
                        </span>
                        <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                          profile.stressLevel === 'CRITICAL' || profile.stressLevel === 'HIGH' ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-emerald-500'
                        }`}>
                          {profile.stressLevel} STRESS
                        </div>
                      </div>
                      <h4 className="text-7xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
                        {profile.primaryEmotion}
                      </h4>
                      <div className="flex items-center gap-6">
                        <div className="flex-1 bg-slate-800 h-3 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 shadow-[0_0_15px_#6366f1]" style={{ width: `${profile.confidenceScore}%` }}></div>
                        </div>
                        <span className="font-mono text-indigo-400 text-sm font-bold">{profile.confidenceScore}% ACCURACY</span>
                      </div>
                    </div>
                    <i className="fa-solid fa-fingerprint absolute -bottom-16 -right-16 text-[20rem] opacity-[0.03] rotate-12"></i>
                  </div>

                  {/* Details */}
                  <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10">
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3">
                        <i className="fa-solid fa-list-check text-indigo-500"></i> Micro-Features Detected
                      </h5>
                      <div className="flex flex-wrap gap-3">
                        {profile.microExpressions.map((cue, i) => (
                          <span key={i} className="px-6 py-3 bg-slate-50 text-slate-800 text-xs rounded-2xl border border-slate-100 font-black uppercase tracking-tight">
                            {cue}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-10 border-t border-slate-50">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Psychological Pattern</h5>
                      <p className="text-slate-800 text-xl leading-relaxed font-brand font-bold italic">
                        "{profile.psychologicalContext}"
                      </p>
                    </div>

                    <div className="p-10 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                      <div className="relative z-10">
                        <h5 className="text-xs font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                          <i className="fa-solid fa-bolt-lightning text-amber-300"></i> Clinical Directive
                        </h5>
                        <p className="text-indigo-50 text-lg leading-relaxed font-medium">{profile.recommendedIntervention}</p>
                      </div>
                      <i className="fa-solid fa-heart-pulse absolute -bottom-4 -right-4 text-8xl opacity-10"></i>
                    </div>
                  </div>
                </div>
              ) : null}

              {error && (
                <div className="bg-rose-50 p-12 rounded-[3rem] border border-rose-100 text-rose-600 text-center shadow-inner">
                  <i className="fa-solid fa-circle-exclamation text-5xl mb-6"></i>
                  <p className="font-black text-2xl mb-2">System Interruption</p>
                  <p className="text-sm opacity-80 mb-8">{error}</p>
                  <button 
                    onClick={() => {setImage(null); setError(null); startCamera();}} 
                    className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-xl hover:bg-rose-700 transition-all"
                  >
                    Attempt Re-Calibration
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes scanning {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default EmotionScanner;
