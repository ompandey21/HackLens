import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const StepItem = ({ number, title, description, delay }) => (
  <motion.div
    className="step-item"
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.3 }}
  >
    <motion.div 
      className="step-number"
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
    >
      {number}
    </motion.div>
    <motion.div 
      className="step-content"
      whileHover={{ x: 5 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="step-title">{title}</h3>
      <p className="step-description">{description}</p>
    </motion.div>
  </motion.div>
);

// Enhanced How It Works Section Component
const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Project Submission",
      description: "Teams submit their projects including repositories, documentation, and presentation materials through our streamlined interface with automated validation."
    },
    {
      number: "02", 
      title: "AI Analysis",
      description: "Our advanced AI system analyzes code quality, innovation metrics, user experience factors, and market potential using sophisticated machine learning algorithms."
    },
    {
      number: "03",
      title: "Detailed Results",
      description: "Receive comprehensive evaluation reports with detailed scores, constructive feedback, improvement suggestions, and competitive rankings within minutes."
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="section-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">How HackLens Works</h2>
          <p className="section-subtitle">
            Simple three-step process for comprehensive hackathon evaluation powered by cutting-edge AI technology
          </p>
        </motion.div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <StepItem
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;