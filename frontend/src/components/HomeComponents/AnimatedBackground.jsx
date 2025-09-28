import {React} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const AnimatedBackground = () => {
  return (
    <div className="animated-background">
      <div className="bg-gradient" />
      
      {/* Grid Lines */}
      <div className="grid-lines">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`vertical-${i}`}
            className="grid-line-vertical"
            style={{ left: `${i * 5}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{
              duration: 4,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
        
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`horizontal-${i}`}
            className="grid-line-horizontal"
            style={{ top: `${i * 6.67}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 5,
              delay: i * 0.3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
      
      {/* Floating Orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="floating-orb"
          style={{
            width: Math.random() * 300 + 100,
            height: Math.random() * 300 + 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground