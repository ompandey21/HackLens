import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const VisualCard = ({ icon, label, delay, className }) => (
  <motion.div 
    className={`visual-card ${className} fade-in-up`}
    initial={{ opacity: 0, y: 30, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ 
      duration: 0.6, 
      delay: delay,
      ease: "easeOut"
    }}
    whileHover={{ 
      y: -8, 
      scale: 1.05,
      transition: { duration: 0.2 }
    }}
  >
    {icon}
    <span>{label}</span>
  </motion.div>
);

export default VisualCard;