import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 

  ArrowRight
} from 'lucide-react';
const CTASection = () => {
  const handleGetStarted = () => {
    console.log('Routing to login page...');
  };

  return (
    <section className="cta-section">
      <div className="section-container">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="cta-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Revolutionize Your Hackathon?
          </motion.h2>
          <motion.p 
            className="cta-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Start using AI-powered evaluation for fair, fast, and comprehensive judging that eliminates bias
          </motion.p>
          <motion.button 
            className="cta-button-large"
            onClick={handleGetStarted}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.05,
              y: -3,
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            Start Free Trial
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
export default CTASection;