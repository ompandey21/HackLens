// src/pages/Hackathon/Details/components/HeaderSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Cpu, Code2, Rocket, ShieldCheck } from "lucide-react";

const typeIcon = (type) => {
  if (type === "ml_hackathon") return <Cpu size={18} />;
  if (type === "codeathon") return <Code2 size={18} />;
  return <Rocket size={18} />;
};

const HeaderSection = ({ name, type, active, createdBy, createdAt, onBack }) => {
  const created = createdAt ? new Date(createdAt) : null;

  return (
    <motion.div
      className="header"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <div className="badges" style={{ marginBottom: "0.5rem" }}>
          <span className="badge cyan">{typeIcon(type)} {type.replace("_", " ")}</span>
          <span className={`badge ${active ? "green" : "gray"}`}>
            <ShieldCheck size={16} />
            {active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="header-title">{name}</div>
        <div className="header-sub">
          Created by <b>{createdBy}</b>
          {created ? ` • ${created.toLocaleDateString()}` : ""}
        </div>
      </div>

      <div className="header-actions">
        <button className="btn ghost" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    </motion.div>
  );
};

export default HeaderSection;
