// src/pages/Hackathon/Details/components/TimelineCard.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

const daysLeftText = (start, end) => {
  const now = new Date();
  const s = new Date(start);
  const e = new Date(end);

  if (now < s) {
    const diff = Math.ceil((s - now) / (1000 * 60 * 60 * 24));
    return `${diff} day(s) to start`;
  } else if (now >= s && now <= e) {
    const diff = Math.ceil((e - now) / (1000 * 60 * 60 * 24));
    return `${diff} day(s) remaining`;
  } else {
    return "Ended";
  }
};

const TimelineCard = ({ start, end }) => {
  const summary = useMemo(() => daysLeftText(start, end), [start, end]);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
    >
      <div className="card-title"><Calendar size={16} /> Timeline</div>
      <div className="card-body">
        <div className="meta-grid">
          <div className="meta-item">
            <Calendar size={16} />
            <span>Start: {new Date(start).toLocaleString()}</span>
          </div>
          <div className="meta-item">
            <Calendar size={16} />
            <span>End: {new Date(end).toLocaleString()}</span>
          </div>
          <div className="meta-item">
            <Clock size={16} />
            <span>{summary}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineCard;
