import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User
} from 'lucide-react';
const RoleSelector = ({ selected, onChange, error }) => {
  const roles = [
    { value: "participant", label: "Participant", icon: User },
    { value: "judge", label: "Judge", icon: Shield },
    { value: "admin", label: "Admin", icon: Shield },
  ];

  return (
    <div className="role-selector">
      <label className="role-label">Select Role</label>
      <div className="role-options">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <motion.button
              key={role.value}
              type="button"
              onClick={() => onChange(role.value)}
              className={`role-option ${
                selected === role.value ? "active" : ""
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={20} />
              <span>{role.label}</span>
              {selected === role.value && (
                <motion.div
                  layoutId="role-indicator"
                  className="role-indicator"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default RoleSelector;