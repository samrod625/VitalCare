import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  Volume2, 
  RefreshCw, 
  TrendingUp, 
  Sparkles, 
  Loader, 
  Play, 
  Pause,
  Activity,
  FileText,
  CheckCircle2,
  Bot,
  BarChart3
} from 'lucide-react';
import axios from 'axios';

// --- 1. Internal CSS & Animations (Standard VitalCare Theme) ---
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  .animate-float-slow { animation: float 6s ease-in-out infinite; }
  .animate-float-medium { animation: float 5s ease-in-out infinite; }
  
  .reveal-section {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
    will-change: opacity, transform;
  }
  .reveal-section.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .result-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .result-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .result-scroll::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 20px;
  }
`;

// --- 2. Helper Components ---

const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.disconnect(); };
  }, []);

  return (
    <div ref={ref} className={`reveal-section ${isVisible ? "is-visible" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const BackgroundIcon = ({ icon: Icon, className }) => (
  <div className={`absolute opacity-5 md:opacity-10 pointer-events-none select-none ${className}`} aria-hidden="true">
    <Icon className="w-full h-full" />
  </div>
);

const VoiceAssessment = () => {
  // Default level to 'beginner' internally since UI selector is removed
  const [level, setLevel] = useState('beginner');
  const [prompt, setPrompt] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [isPlayingFeedback, setIsPlayingFeedback] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  
  // Ref for scrolling to results
  const resultsRef = useRef(null);

  useEffect(() => {
    generateNewPrompt();
  }, []);

  const generateNewPrompt = async () => {
    setLoadingPrompt(true);
    setResult(null);
    setAudioBlob(null);

    try {
      const formData = new FormData();
      formData.append('level', level);
      formData.append('user_id', 'demo_user');

      const response = await axios.post(
        'http://localhost:5000/api/ml/voice-assessment/generate-prompt',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setPrompt(response.data.prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
      alert('Failed to generate prompt.');
    } finally {
      setLoadingPrompt(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      alert('Could not access microphone. Please grant permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeRecording = async () => {
    if (!audioBlob || !prompt) return;
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('expected_text', prompt.text);
      formData.append('level', level);
      formData.append('user_id', 'demo_user');

      const response = await axios.post(
        'http://localhost:5000/api/ml/voice-assessment/analyze',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000
        }
      );
      setResult(response.data);
      
      // Scroll to results after a short delay to ensure rendering
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);

    } catch (error) {
      alert('Analysis failed. Check console for details.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const playFeedbackAudio = () => {
    if (!result?.audio_feedback_url) return;
    const audioUrl = `http://localhost:8006${result.audio_feedback_url}`;
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlayingFeedback(true);
      audioRef.current.onended = () => setIsPlayingFeedback(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-slate-100 overflow-x-hidden font-sans">
      <style>{customStyles}</style>

      <div className="max-w-[90rem] mx-auto px-6 py-8 lg:py-16">
        
        {/* ================= HEADER ================= */}
        <section className="relative py-12 flex flex-col items-center text-center mb-12">
          <BackgroundIcon icon={Mic} className="w-48 h-48 top-0 left-10 text-cyan-500 animate-float-slow" />
          <BackgroundIcon icon={Activity} className="w-32 h-32 bottom-0 right-10 text-teal-400 animate-float-medium" />
          
          <RevealOnScroll>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-700 rounded-full font-bold text-sm mb-6 border border-cyan-100">
              <Volume2 className="w-4 h-4" />
              Speech Therapy AI
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
              Voice Assessment Agent
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              AI-powered speech analysis and pronunciation feedback using advanced audio processing models.
            </p>
          </RevealOnScroll>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* ================= LEFT: INTERACTION ================= */}
          <RevealOnScroll delay={100}>
            <div className="bg-white border border-gray-200 rounded-[2rem] p-8 lg:p-12 shadow-xl relative overflow-hidden h-full">
              
              {/* Prompt Card */}
              <div className="relative group mb-8">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center min-h-[160px] justify-center">
                  {loadingPrompt ? (
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Loader className="w-8 h-8 animate-spin text-cyan-500" />
                      <span className="text-sm font-medium">Generating Prompt...</span>
                    </div>
                  ) : prompt ? (
                    <>
                      <Sparkles className="w-6 h-6 text-cyan-400 mb-3" />
                      <p className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed">"{prompt.text}"</p>
                    </>
                  ) : (
                    <p className="text-slate-400">Tap refresh to generate a prompt</p>
                  )}
                  
                  <button 
                    onClick={generateNewPrompt}
                    disabled={loadingPrompt || isRecording}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-cyan-600 hover:bg-white rounded-full transition-all"
                  >
                    <RefreshCw className={`w-5 h-5 ${loadingPrompt ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                {!isRecording && !audioBlob && (
                  <button
                    onClick={startRecording}
                    disabled={!prompt || loadingPrompt}
                    className="w-full py-5 bg-cyan-600 text-white rounded-2xl font-bold hover:bg-cyan-700 transition-all shadow-lg hover:shadow-cyan-200 hover:-translate-y-1 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mic className="w-6 h-6" /> Start Recording
                  </button>
                )}

                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-3 text-lg animate-pulse"
                  >
                    <Square className="w-5 h-5" /> Stop Recording...
                  </button>
                )}

                {audioBlob && !isRecording && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-bold text-sm">Audio Captured Successfully</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => { setAudioBlob(null); setResult(null); }}
                        className="py-4 bg-white text-slate-600 border-2 border-slate-200 rounded-xl font-bold hover:border-slate-300 hover:bg-slate-50 transition-all"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={analyzeRecording}
                        disabled={isAnalyzing}
                        className="py-4 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isAnalyzing ? <Loader className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
                        Analyze
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </RevealOnScroll>

          {/* ================= RIGHT: RESULTS ================= */}
          <RevealOnScroll delay={200}>
            <div 
              ref={resultsRef} 
              className={`bg-white border border-gray-200 rounded-[2rem] p-8 lg:p-12 shadow-xl h-full flex flex-col transition-all duration-500 ${!result ? "justify-center items-center text-center min-h-[600px]" : ""}`}
            >
              
              {result ? (
                <div className="w-full h-full flex flex-col">
                  {/* Result Header */}
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                      <Activity className="w-6 h-6 text-cyan-600" /> Analysis Report
                    </h2>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border ${getScoreColor(result.analysis.overall_score)}`}>
                       {result.analysis.overall_score >= 80 ? 'Excellent' : result.analysis.overall_score >= 60 ? 'Good' : 'Practice Needed'}
                    </span>
                  </div>

                  {/* Score Card */}
                  <div className="mb-6 relative overflow-hidden rounded-2xl bg-slate-900 text-white p-8 shadow-lg">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500 to-blue-600 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex items-end justify-between">
                      <div>
                        <p className="text-slate-400 font-medium mb-1">Overall Proficiency</p>
                        <h3 className="text-5xl font-extrabold tracking-tight">{result.analysis.overall_score}<span className="text-2xl text-slate-500">/100</span></h3>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-inner">
                        <Activity className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto result-scroll pr-2 space-y-6 max-h-[400px]">
                    
                    {/* Detailed Scores */}
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(result.analysis.scores).map(([key, value]) => {
                        if (key === 'overall') return null;
                        return (
                          <div key={key} className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">{key}</p>
                            <p className="text-xl font-bold text-slate-800">{value}%</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Feedback */}
                    <div className="bg-cyan-50/50 border border-cyan-100 rounded-xl p-5">
                      <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Bot className="w-4 h-4 text-cyan-600" /> AI Feedback
                      </h3>
                      <p className="text-slate-700 text-sm leading-relaxed italic">"{result.feedback.text}"</p>
                      
                      <button
                        onClick={playFeedbackAudio}
                        disabled={isPlayingFeedback}
                        className="mt-4 w-full py-3 bg-white border border-cyan-200 text-cyan-700 rounded-xl font-bold hover:bg-cyan-50 transition flex items-center justify-center gap-2 text-sm"
                      >
                        {isPlayingFeedback ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlayingFeedback ? "Playing Feedback..." : "Listen to Coach"}
                      </button>
                    </div>

                    {/* Suggestions */}
                    {result.feedback.suggestions?.length > 0 && (
                      <div>
                         <h3 className="font-bold text-slate-900 mb-3">Improvement Tips</h3>
                         <ul className="space-y-2">
                           {result.feedback.suggestions.map((tip, i) => (
                             <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl text-sm text-slate-700 border border-slate-100">
                               <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0"></div> {tip}
                             </li>
                           ))}
                         </ul>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                 // Empty State
                <>
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <FileText className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to Analyze</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    Record your voice on the left to generate a detailed speech analysis report.
                  </p>
                </>
              )}
            </div>
          </RevealOnScroll>
        </div>

        {/* Hidden Audio */}
        <audio ref={audioRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default VoiceAssessment;