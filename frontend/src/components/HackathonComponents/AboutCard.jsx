import React from "react";
import { motion } from "framer-motion";
import { FileText, BookOpen } from "lucide-react";

const AboutCard = ({ description, title = "About this Hackathon", icon = "about" }) => {
  const Icon = icon === "rules" ? BookOpen : FileText;
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="card-title">
        <Icon size={16} /> {title}
      </div>
      <div className="card-body">
        {String(description).split("\n").map((line, i) => (
          <p key={i} style={{ textAlign: "justify", margin: "0 0 0.6rem" }}>
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
};

export default AboutCard;
