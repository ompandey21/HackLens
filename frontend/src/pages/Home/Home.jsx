import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Brain, 
  Zap, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Code, 
  Lightbulb, 
  Target,
  Menu,
  X,
  BarChart3,
  FileText,
  Cpu,
  Shield,
  Clock,
  Award
} from 'lucide-react';
import './Home.css';
import AnimatedBackground from '../../components/HomeComponents/AnimatedBackground';
import Navbar from '../../components/HomeComponents/Navbar';
import HeroSection from '../../components/HomeComponents/HeroSection';
import FeaturesSection from '../../components/HomeComponents/FeaturesSection';
import HowItWorksSection from '../../components/HomeComponents/HowItWorksSection';
import CTASection from '../../components/HomeComponents/CTASection';
import StatsSection from '../../components/HomeComponents/StatsSection';
import Footer from '../../components/HomeComponents/Footer';



// Enhanced Navbar Component


// Visual Card Component


// Enhanced Hero Section Component


// Stats Item Component

// Feature Card Component


// Enhanced Features Section Component

// Step Item Component

// Enhanced CTA Section Component  


// Footer Link Component

// Scroll Progress Indicator Component
const ScrollProgressIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 z-50"
      style={{ width: `${scrollProgress}%` }}
      initial={{ width: 0 }}
      animate={{ width: `${scrollProgress}%` }}
      transition={{ duration: 0.1 }}
    />
  );
};

// Floating Action Button Component
const FloatingActionButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full shadow-lg z-40 flex items-center justify-center cursor-pointer border-none"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 100 }}
          whileHover={{ 
            scale: 1.1, 
            boxShadow: "0 8px 25px rgba(14, 165, 233, 0.4)" 
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowRight size={20} style={{ transform: 'rotate(-90deg)' }} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Loading Component
const PageLoader = ({ isLoading }) => (
  <AnimatePresence>
    {isLoading && (
      <motion.div
        className="fixed inset-0 bg-white z-50 flex items-center justify-center"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          <motion.div
            className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            HackLens
          </motion.div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Main Home Component
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Add intersection observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .slide-in-bottom');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isLoading]);

  return (
    <div className="home">
      <PageLoader isLoading={isLoading} />
      
      {!isLoading && (
        <>
          <AnimatedBackground />
          <ScrollProgressIndicator />
          <Navbar />
          <main>
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <HowItWorksSection />
            <CTASection />
          </main>
          <Footer />
          <FloatingActionButton />
        </>
      )}
    </div>
  );
};

export default Home;