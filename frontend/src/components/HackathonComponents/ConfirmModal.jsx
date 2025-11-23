// src/pages/Hackathon/Details/components/ConfirmModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmModal = ({ open, title, message, confirmText, cancelText, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.22 }}
          >
            <div className="modal-title">{title}</div>
            <div className="modal-body">{message}</div>
            <div className="modal-actions">
              <button className="btn ghost" onClick={onCancel}>{cancelText || "Cancel"}</button>
              <button className="btn danger" onClick={onConfirm}>{confirmText || "Confirm"}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
