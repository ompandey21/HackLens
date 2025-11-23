import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Upload,
  Github,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Users,
  FileText,
  Download,
  Send,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Trophy,
  Zap,
  BarChart3,
  Activity,
  Plus,
  X,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  Code,
  Layers,
  Target,
  Bell,
  Search,
  Calendar,
  Link as LinkIcon,
  Brain // Added Brain, as it was missing from your imports
} from 'lucide-react';
// Overview Tab Component
// Corrected class names and structure to match CSS
const OverviewTab = ({ userData, hackathonData }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 30 });

  useEffect(() => {
    // ... timer logic (unchanged)
  }, []);

  const stats = [
    { icon: <Upload />, label: 'Total Submissions', value: '5', color: 'blue' },
    { icon: <Clock />, label: 'Pending Evaluations', value: '2', color: 'yellow' },
    { icon: <Trophy />, label: 'Best Score', value: '92/100', color: 'green' },
    { icon: <MessageSquare />, label: 'Feedback Received', value: '3', color: 'purple' }
  ];

  // Simplified countdown structure to match CSS
  const simpleTimeLeft = `${timeLeft.days}d : ${timeLeft.hours}h : ${timeLeft.minutes}m`;

  return (
    <div className="overview-section"> {/* CORRECTED */}
      <div className="welcome-banner"> {/* CORRECTED */}
        <div className="welcome-content"> {/* CORRECTED */}
          <h1 className="welcome-title">Welcome back, {userData.name}! 👋</h1> {/* CORRECTED h2->h1 */}
          <p className="welcome-subtitle">Let's continue building something amazing</p> {/* CORRECTED */}
        </div>
      </div>

      <div className="hackathon-info-card">
        <div className="hackathon-header">
          <div className="hackathon-title"> {/* CORRECTED */}
            <h2>{hackathonData.name}</h2> {/* CORRECTED h3->h2 */}
            <p className="hackathon-theme">{hackathonData.theme}</p>
          </div>
          {/* Used existing CSS button styles */}
          <a href="#" className="btn btn-secondary"> {/* CORRECTED */}
            <FileText size={16} />
            View Rules
          </a>
        </div>
        
        {/* Corrected countdown structure to match CSS */}
        <div className="countdown-timer">
          <div className="countdown-label">Time Left</div>
          <div className="countdown-value">{simpleTimeLeft}</div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={`stat-card ${stat.color}`} // 'color' class is unstyled, but harmless
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Corrected stat card structure to match CSS */}
            <div className="stat-header">
              <div className="stat-icon">{stat.icon}</div>
            </div>
            <div className="stat-title">{stat.label}</div> {/* CORRECTED */}
            <div className="stat-value">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* This "Quick Actions" section was unstyled in your CSS.
        I've wrapped it in `.submit-form-card` (a generic card style from your CSS)
        and used the `.btn` classes to make it look intentional.
      */}
      <div className="submit-form-card"> {/* RE-USED STYLE */}
        <h3 className="section-title">Quick Actions</h3>
        <div className="action-buttons">
          <button className="btn btn-primary"> {/* CORRECTED */}
            <Upload size={20} />
            New Submission
          </button>
          <button className="btn btn-secondary"> {/* CORRECTED */}
            <BarChart3 size={20} />
            View Analytics
          </button>
          <button className="btn btn-secondary"> {/* CORRECTED */}
            <Users size={20} />
            Manage Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;