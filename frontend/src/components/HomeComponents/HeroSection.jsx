import VisualCard from "./VisualCard";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  ArrowRight, 
 
  Code, 
  Lightbulb, 
  Target,
  X,
  BarChart3,
  FileText,
  Award
} from 'lucide-react';
const HeroSection = () => {
  const handleGetStarted = () => {
    console.log('Routing to login page...');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const visualCards = [
    { icon: <Code size={32} />, label: "Code Analysis", className: "card-1" },
    { icon: <Lightbulb size={32} />, label: "Innovation", className: "card-2" },
    { icon: <Target size={32} />, label: "Impact", className: "card-3" },
    { icon: <BarChart3 size={32} />, label: "Scoring", className: "card-4" },
    { icon: <Brain size={32} />, label: "AI Judge", className: "card-5" },
    { icon: <FileText size={32} />, label: "Reports", className: "card-6" }
  ];

  return (
    <section className="hero-section">
      <div className="hero-container">
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-text" variants={itemVariants}>
            <motion.h1 
              className="hero-title"
              variants={itemVariants}
            >
              The AI-Powered <span className="title-accent">Hackathon Judge</span>
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              variants={itemVariants}
            >
              A comprehensive evaluation system for credible hackathon judging using advanced AI algorithms
            </motion.p>
            <motion.button 
              className="cta-button"
              onClick={handleGetStarted}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -3,
                boxShadow: "0 12px 40px rgba(14, 165, 233, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="hero-visual"
            variants={itemVariants}
          >
            <div className="visual-grid">
              {visualCards.map((card, index) => (
                <VisualCard
                  key={index}
                  icon={card.icon}
                  label={card.label}
                  className={card.className}
                  delay={0.1 * (index + 1)}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;