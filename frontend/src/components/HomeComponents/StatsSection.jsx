import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const StatItem = ({ value, label, delay }) => (
  <motion.div
    className="stat-item fade-in-up"
    initial={{ opacity: 0, y: 20, scale: 0.8 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.3 }}
    whileHover={{ 
      scale: 1.05, 
      y: -5,
      transition: { duration: 0.2 }
    }}
  >
    <motion.div 
      className="stat-value"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: delay + 0.3, duration: 0.8 }}
      viewport={{ once: true }}
    >
      {value}
    </motion.div>
    <div className="stat-label">{label}</div>
  </motion.div>
);

// Enhanced Stats Section Component
const StatsSection = () => {
  const stats = [
    { value: "95%", label: "Accuracy Rate" },
    { value: "10x", label: "Faster Evaluation" },
    { value: "50+", label: "Criteria Points" },
    { value: "100%", label: "Bias Elimination" }
  ];

  return (
    <section className="stats-section">
      <div className="section-container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              label={stat.label}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;