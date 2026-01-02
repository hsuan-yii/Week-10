
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Activity, CheckCircle, RefreshCcw } from 'lucide-react';
import Droplet from './components/Droplet';
import { State } from './types';
import { CONFIGS } from './constants';
import { getReflection } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<State>(State.ANXIOUS);
  const [reflection, setReflection] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);

  const fetchReflection = useCallback(async (currentState: State) => {
    setLoading(true);
    const msg = await getReflection(currentState);
    setReflection(msg);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Initial load
    fetchReflection(State.ANXIOUS);
  }, [fetchReflection]);

  const handleNextState = () => {
    if (state === State.ANXIOUS) {
      setState(State.TRANSITION);
      fetchReflection(State.TRANSITION);
    } else if (state === State.TRANSITION) {
      setState(State.CALM);
      fetchReflection(State.CALM);
    }
  };

  const reset = () => {
    setState(State.ANXIOUS);
    fetchReflection(State.ANXIOUS);
    setCounter(0);
  };

  // Timer simulation for breathing guide
  useEffect(() => {
    let interval: any;
    if (state !== State.ANXIOUS) {
      interval = setInterval(() => {
        setCounter((prev) => (prev + 1) % 100);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [state]);

  const config = CONFIGS[state];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-slate-100 relative overflow-hidden bg-[#0a0a0c]">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <main className="w-full max-w-lg z-10 flex flex-col items-center">
        <header className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-light tracking-widest mb-2"
          >
            呼吸水滴
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-light uppercase tracking-tighter"
          >
            從焦慮到安定 ｜ Week 10
          </motion.p>
        </header>

        <Droplet state={state} />

        <div className="text-center mt-12 mb-8 h-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={state + reflection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-xl md:text-2xl font-light text-slate-300 px-4 italic leading-relaxed">
                {loading ? "..." : reflection || "感受當下的呼吸"}
              </p>
              <p className="mt-4 text-xs font-medium text-blue-400/80 tracking-widest uppercase">
                {config.label}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic Progress Bar (Breathing Guide) */}
        {state !== State.ANXIOUS && (
          <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mb-12">
            <motion.div 
              className="h-full bg-blue-400/40"
              animate={{ width: `${counter}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>
        )}

        {/* Interaction Controls */}
        <div className="flex flex-col items-center gap-6">
          <AnimatePresence mode="wait">
            {state !== State.CALM ? (
              <motion.button
                key="action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextState}
                className="group relative px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-md"
              >
                {state === State.ANXIOUS ? (
                  <>
                    <Wind className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform" />
                    <span className="font-light tracking-widest">開始引導</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5 text-teal-400 animate-pulse" />
                    <span className="font-light tracking-widest">再緩一點</span>
                  </>
                )}
              </motion.button>
            ) : (
              <motion.div
                key="done-btn"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-3 px-8 py-4 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 backdrop-blur-md">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-light tracking-widest">身心已回歸平靜</span>
                </div>
                <button 
                  onClick={reset}
                  className="text-slate-500 hover:text-slate-300 text-sm flex items-center gap-2 transition-colors mt-2"
                >
                  <RefreshCcw className="w-4 h-4" />
                  重新開始
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Decorative side text */}
      <div className="fixed bottom-10 left-10 hidden lg:block opacity-20 vertical-text text-sm tracking-[1em] select-none">
        DESIGN POSITION: FLOWING
      </div>
      <div className="fixed top-1/2 right-10 hidden lg:block opacity-20 vertical-text text-sm tracking-[1em] select-none transform -translate-y-1/2">
        STAY IN THE MOMENT
      </div>

      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
};

export default App;
