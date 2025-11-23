import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Activity, Cpu, Code2, Rocket, Users } from "lucide-react";

const typeIcon = (type) => {
  if (type === "ml_hackathon") return <Cpu size={16} />;
  if (type === "codeathon") return <Code2 size={16} />;
  return <Rocket size={16} />;
};

const Row = ({ icon, children, delay = 0 }) => (
  <motion.div
    className="meta-item"
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.25, delay }}
  >
    {icon}
    <span>{children}</span>
  </motion.div>
);

const InfoSidebar = ({ start, end, type, createdBy, isActive, participantsCount, registrationDeadline }) => {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.05 }}
    >
      <div className="card-title">At a glance</div>
      <div className="card-body">
        <div className="meta-grid">
          <Row icon={<Calendar size={16} />} delay={0.00}>
            Start: {new Date(start).toLocaleString()}
          </Row>
          <Row icon={<Calendar size={16} />} delay={0.05}>
            End: {new Date(end).toLocaleString()}
          </Row>
          <Row icon={<Clock size={16} />} delay={0.1}>
            {(() => {
              const now = new Date();
              const s = new Date(start);
              const e = new Date(end);
              if (now < s) {
                const d = Math.ceil((s - now) / 86400000);
                return `${d} day(s) to start`;
              } else if (now >= s && now <= e) {
                const d = Math.ceil((e - now) / 86400000);
                return `${d} day(s) remaining`;
              } else return "Ended";
            })()}
          </Row>
          <Row icon={typeIcon(type)} delay={0.15}>Type: {type.replace("_", " ")}</Row>
          <Row icon={<Activity size={16} />} delay={0.2}>Status: {isActive ? "Active" : "Inactive"}</Row>
          <Row icon={<Users size={16} />} delay={0.25}>Participants: {participantsCount ?? "—"}</Row>
          {registrationDeadline && (
            <Row icon={<Calendar size={16} />} delay={0.3}>
              Registration deadline: {new Date(registrationDeadline).toLocaleString()}
            </Row>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default InfoSidebar;
