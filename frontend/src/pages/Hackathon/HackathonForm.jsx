// src/components/HackathonForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  FileText,
  Type,
  CheckCircle,
  AlertCircle,
  Loader,
  Eye,
  ArrowLeft
} from "lucide-react";
import "./HackathonForm.css";

const HackathonForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hackathon_type: "hackathon",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("jwt_token");

      const response = await axios.post(
        "http://localhost:8000/hackathon/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Hackathon created successfully!");
      setTimeout(() => {
        navigate("/hackathons");
      }, 1500);
    } catch (error) {
      console.error("Error creating hackathon:", error);
      if (error.response?.data?.detail)
        setMessage(`❌ ${error.response.data.detail}`);
      else setMessage("❌ Failed to create hackathon. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hackathon-form-page">
      {/* Header */}
      <header className="form-header">
        <div className="header-container">
          <div className="header-left">
            <Eye className="header-logo" />
            <h1 className="header-title">HackLens</h1>
          </div>
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </header>

      {/* Form Container */}
      <div className="form-content-wrapper">
        <motion.div
          className="form-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="form-header-section">
            <h2 className="form-title">Create New Hackathon</h2>
            <p className="form-subtitle">Set up your hackathon event details</p>
          </div>

          <form onSubmit={handleSubmit} className="hackathon-form">
            {/* Name Field */}
            <div className="form-group">
              <label className="form-label">
                <Type size={16} />
                Hackathon Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter hackathon name"
                required
              />
            </div>

            {/* Description Field */}
            <div className="form-group">
              <label className="form-label">
                <FileText size={16} />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Describe your hackathon theme and objectives"
                rows="4"
                required
              />
            </div>

            {/* Type Field */}
            <div className="form-group">
              <label className="form-label">
                <CheckCircle size={16} />
                Hackathon Type
              </label>
              <select
                name="hackathon_type"
                value={formData.hackathon_type}
                onChange={handleChange}
                className="form-select"
              >
                <option value="ml_hackathon">ML Hackathon</option>
                <option value="codeathon">Codeathon</option>
                <option value="hackathon">Hackathon</option>
              </select>
            </div>

            {/* Date Fields */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} />
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  placeholder="XX-XX-XXXX"
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} />
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Active Checkbox */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="checkbox-text">
                  Set hackathon as active immediately
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="submit-button"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <Loader size={18} className="spinner" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Create Hackathon
                </>
              )}
            </motion.button>
          </form>

          {/* Message Display */}
          {message && (
            <motion.div
              className={`message-box ${message.startsWith("✅") ? "success" : "error"}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message.startsWith("✅") ? (
                <CheckCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <span>{message}</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HackathonForm;