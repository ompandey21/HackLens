import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const RegisterModal = ({ open, name, start, end, onCancel, onConfirm }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="modal"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.22 }}
          >
            <div className="modal-title">Register for {name}</div>
            <div className="modal-body">
              <p><b>Starts:</b> {new Date(start).toLocaleString()}</p>
              <p><b>Ends:</b> {new Date(end).toLocaleString()}</p>
            </div>
            <div className="modal-actions">
              <button className="btn ghost" onClick={onCancel}>Cancel</button>
              <button className="btn primary" onClick={onConfirm}>Confirm Registration</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;
