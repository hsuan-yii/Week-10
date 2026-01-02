
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { State } from '../types';
import { CONFIGS } from '../constants';

interface DropletProps {
  state: State;
}

const Droplet: React.FC<DropletProps> = ({ state }) => {
  const config = CONFIGS[state];

  // Randomly slightly different paths for a "liquid" feel
  const paths = useMemo(() => [
    "M50 5 C30 5 10 35 10 65 C10 85 28 95 50 95 C72 95 90 85 90 65 C90 35 70 5 50 5 Z",
    "M50 8 C35 8 15 35 15 65 C15 82 30 92 50 92 C70 92 85 82 85 65 C85 35 65 8 50 8 Z",
    "M50 2 C25 2 5 35 5 65 C5 88 25 98 50 98 C75 98 95 88 95 65 C95 35 75 2 50 2 Z",
  ], []);

  return (
    <div className="relative flex items-center justify-center w-full h-96">
      {/* Background Ripples - Only show more when calming */}
      <AnimatePresence>
        {state !== State.ANXIOUS && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="ripple w-64 h-64" 
                style={{ animationDelay: `${i * 1.5}s` }} 
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Main Droplet */}
      <motion.svg
        viewBox="0 0 100 100"
        className="w-48 h-48 md:w-64 md:h-64 z-10 filter drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
        animate={{
          scale: [config.scale, config.scale * 1.05, config.scale],
          y: state === State.ANXIOUS ? [0, -5, 0] : [0, -2, 0],
        }}
        transition={{
          duration: config.speed,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <defs>
          <linearGradient id="dropletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={config.color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={config.color} stopOpacity="0.4" />
          </linearGradient>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          </filter>
        </defs>

        <motion.path
          d={paths[0]}
          fill="url(#dropletGradient)"
          animate={{
            d: paths,
          }}
          transition={{
            duration: state === State.ANXIOUS ? 1 : 4,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
          }}
        />
      </motion.svg>

      {/* Glowing Aura */}
      <motion.div
        className="absolute w-48 h-48 rounded-full blur-3xl opacity-20"
        animate={{
          backgroundColor: config.color,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: config.speed,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default Droplet;
