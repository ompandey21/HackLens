import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Mail, Shield, Edit, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) throw new Error("No token");

        const res = await axios.get("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p className="loading">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-page">
        <p className="error">{error || "User not found."}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="profile-card"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="profile-header">
          <User size={64} className="profile-icon" />
          <h1>{user.name}</h1>
          <p className="role-badge">{user.role.toUpperCase()}</p>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <Mail size={18} />
            <span>{user.email}</span>
          </div>
          <div className="detail-item">
            <Shield size={18} />
            <span>@{user.username}</span>
          </div>
        </div>

        <div className="profile-actions">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="btn edit-btn"
            onClick={() => navigate("/update-profile")}
          >
            <Edit size={18} /> Update Info
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="btn logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} /> Log Out
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;
