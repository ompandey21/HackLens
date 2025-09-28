import { BarChart3, Code, Lightbulb, Target } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    className="feature-card fade-in-up"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.2 }}
    whileHover={{ 
      y: -8, 
      transition: { duration: 0.3, ease: "easeOut" }
    }}
  >
    <motion.div 
      className="feature-icon"
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ duration: 0.2 }}
    >
      {icon}
    </motion.div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </motion.div>
);
const FeaturesSection = () => {
  const features = [
    {
      icon: <Code size={28} />,
      title: "Technical Assessment",
      description: "Evaluate code quality, architecture, and implementation using advanced static analysis and best practices detection."
    },
    {
      icon: <Lightbulb size={28} />,
      title: "Innovation Analysis", 
      description: "Assess creativity, uniqueness, and problem-solving approach with AI-powered insights and novelty detection."
    },
    {
      icon: <Target size={28} />,
      title: "Impact Evaluation",
      description: "Measure real-world applicability, market potential, and societal value of proposed solutions."
    },
    {
      icon: <BarChart3 size={28} />,
      title: "Comprehensive Scoring",
      description: "Generate detailed scorecards with weighted criteria, comparative analysis, and actionable feedback."
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="section-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Core Evaluation Features</h2>
          <p className="section-subtitle">
            Comprehensive analysis across multiple dimensions for fair and accurate assessment of hackathon projects
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;