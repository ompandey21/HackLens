// Header Component
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
// Corrected class names: participant-header -> dashboard-header, header-left -> header-logo, etc.
const DashboardHeader = ({ participantName, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, type: 'success', message: 'Evaluation completed for submission #3', time: '2 min ago' },
    { id: 2, type: 'info', message: 'New hackathon rules updated', time: '1 hour ago' },
    { id: 3, type: 'warning', message: 'Deadline approaching in 2 days', time: '3 hours ago' }
  ]);

  // This component's structure was slightly simplified to match the CSS
  return (
    <header className="dashboard-header"> {/* CORRECTED */}
        <a href="#" className="header-logo"> {/* CORRECTED */}
          <Eye size={32} /> {/* CSS expects 32px */}
          <span>HackLens</span> {/* CSS styles the logo as a single unit */}
        </a>
        
        <div className="header-user"> {/* CORRECTED */}
          <div className="notification-wrapper">
            <button 
              className="notification-button" // This class was unstyled in the CSS, but we'll leave it
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            
            {/* NOTE: Your CSS file doesn't have styles for this dropdown. 
              It has styles for a `.notifications-panel` (a fixed panel).
              I'm keeping your dropdown logic, but it will need new CSS styles to look right.
              For this fix, I'm focusing on what *is* in the CSS file.
            */}
            {showNotifications && (
              <motion.div 
                className="notifications-dropdown" // This class is unstyled in your CSS
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="notifications-header">
                  <h4>Notifications</h4>
                  <button className="mark-read">Mark all read</button>
                </div>
                <div className="notifications-list">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`notification-item ${notif.type}`}>
                      <div className="notification-content">
                        <p>{notif.message}</p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="profile-menu">
            <button 
              className="profile-button" // This class is also unstyled
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="profile-avatar">
                {participantName.charAt(0)}
              </div>
              <span className="profile-name">{participantName}</span>
              <ChevronDown size={16} />
            </button>
            
            {/* This dropdown is also unstyled in your CSS file */}
            {showDropdown && (
              <motion.div 
                className="profile-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button className="dropdown-item">
                  <User size={16} />
                  <span>Profile</span>
                </button>
                <button className="dropdown-item">
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={onLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
    </header>
  );
};

export default DashboardHeader;