import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye
} from 'lucide-react';

const FooterLink = ({ href, children }) => (
  <motion.a
    href={href}
    className="footer-link"
    whileHover={{ x: 5, color: "#0ea5e9" }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.a>
);

// Enhanced Footer Component
const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <motion.div 
          className="footer-content"
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="footer-brand" variants={itemVariants}>
            <div className="footer-logo">
              <Eye size={28} />
              <span>HackLens</span>
            </div>
            <p className="footer-description">
              AI-powered hackathon evaluation for the modern age. Transforming how we assess innovation and creativity in competitive programming.
            </p>
          </motion.div>
          
          <motion.div className="footer-column" variants={itemVariants}>
            <h4>Product</h4>
            <FooterLink href="#features">Features</FooterLink>
            <FooterLink href="#pricing">Pricing</FooterLink>
            <FooterLink href="#demo">Demo</FooterLink>
            <FooterLink href="#api">API Access</FooterLink>
          </motion.div>
          
          <motion.div className="footer-column" variants={itemVariants}>
            <h4>Company</h4>
            <FooterLink href="#about">About Us</FooterLink>
            <FooterLink href="#careers">Careers</FooterLink>
            <FooterLink href="#contact">Contact</FooterLink>
            <FooterLink href="#blog">Blog</FooterLink>
          </motion.div>
          
          <motion.div className="footer-column" variants={itemVariants}>
            <h4>Resources</h4>
            <FooterLink href="#docs">Documentation</FooterLink>
            <FooterLink href="#support">Support</FooterLink>
            <FooterLink href="#community">Community</FooterLink>
            <FooterLink href="#changelog">Changelog</FooterLink>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p>&copy; 2024 HackLens. All rights reserved. Built with ❤️ for the developer community.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;