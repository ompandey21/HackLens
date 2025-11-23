import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, UserPlus, Edit, LayoutGrid, Gavel } from "lucide-react";

const ActionBar = ({
  role,
  onBack,
  onRegister,
  onEdit,
  onManage,
  onEvaluate,
  registered
}) => {
  const isParticipant = role === "participant";
  const isAdmin = role === "admin" || role === "organizer";
  const isJudge = role === "judge";

  return (
    <div className="action-bar sticky">
      <motion.button
        className="btn ghost round"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={onBack}
      >
        <ArrowLeft size={16} /> Back
      </motion.button>

      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
        {isParticipant && (
          <motion.button
            className={`btn ${registered ? "disabled" : "primary"}`}
            disabled={registered}
            whileHover={!registered ? { scale: 1.05 } : {}}
            whileTap={!registered ? { scale: 0.96 } : {}}
            onClick={!registered ? onRegister : undefined}
          >
            <UserPlus size={16} />{" "}
            {registered ? "Registered ✅" : "Register Now"}
          </motion.button>
        )}

        {isAdmin && (
          <>
            <motion.button
              className="btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={onEdit}
            >
              <Edit size={16} /> Edit Hackathon
            </motion.button>
            <motion.button
              className="btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={onManage}
            >
              <LayoutGrid size={16} /> Manage Submissions
            </motion.button>
          </>
        )}
        {isJudge && (
          <motion.button
            className="btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={onEvaluate}
          >
            <Gavel size={16} /> Evaluate Projects
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default ActionBar;
