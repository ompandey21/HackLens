// src/pages/Hackathon/Details/components/DescriptionCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const DescriptionCard = ({ description }) => {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.05 }}
    >
      <div className="card-title"><FileText size={16} /> Description</div>
      <div className="card-body">{description}</div>
    </motion.div>
  );
};

export default DescriptionCard;
