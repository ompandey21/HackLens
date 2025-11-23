import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";

const fmt = (n) => String(n).padStart(2, "0");

const CountdownTimer = ({ start, end }) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const phase = now < s ? "pre" : now <= e ? "live" : "post";
  const target = phase === "pre" ? s : phase === "live" ? e : null;

  let days = 0, hours = 0, mins = 0, secs = 0;
  if (target) {
    const diff = Math.max(0, target - now);
    days = Math.floor(diff / 86400000);
    hours = Math.floor((diff % 86400000) / 3600000);
    mins = Math.floor((diff % 3600000) / 60000);
    secs = Math.floor((diff % 60000) / 1000);
  }

  return (
    <motion.div
      className={`card countdown ${phase}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="card-title">
        <Timer size={16} /> {phase === "pre" ? "Starts in" : phase === "live" ? "Ends in" : "Hackathon Ended"}
      </div>
      {phase !== "post" ? (
        <div className="timer-row">
          <div className="timebox"><div>{fmt(days)}</div><span>Days</span></div>
          <div className="timebox"><div>{fmt(hours)}</div><span>Hours</span></div>
          <div className="timebox"><div>{fmt(mins)}</div><span>Mins</span></div>
          <div className="timebox"><div>{fmt(secs)}</div><span>Secs</span></div>
        </div>
      ) : (
        <div className="card-body" style={{ color: "#94a3b8" }}>This event has concluded.</div>
      )}
    </motion.div>
  );
};

export default CountdownTimer;
