import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Calendar, Brain, CheckCircle, Clock, Send } from "lucide-react";
import "./ParticipantDash.css";

const API_BASE = "http://localhost:8000";

const ParticipantDash = () => {
  const [user, setUser] = useState(null);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt_token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [userRes, subsRes] = await Promise.all([
          axios.get(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE}/participant/hackathons`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const uniqueHacks = await Promise.all(
          subsRes.data.map(async (sub) => {
            const hack = await axios.get(`${API_BASE}/hackathon/${sub._id}`);
            return { ...hack.data, submission: sub };
          })
        );

        setUser(userRes.data);
        setHackathons(uniqueHacks);
      } catch (err) {
        console.error("Failed to fetch participant data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const handleSubmitRedirect = (hackathonId) => {
    navigate(`/submit_project/${hackathonId}`);
  };

  if (loading)
    return <div className="loading-screen">Loading dashboard...</div>;

  return (
    <div className="participant-dashboard">
      {/* User Info */}
      <motion.div
        className="user-info-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="user-details">
          <User size={48} />
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p className="role-tag">{user.role}</p>
          </div>
        </div>
        <div className="join-date">
          <Calendar size={16} /> Joined{" "}
          {new Date(user.created_at).toLocaleDateString()}
        </div>
      </motion.div>

      {/* Hackathon List */}
      <motion.div
        className="hackathons-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3>Your Participating Hackathons</h3>
        {hackathons.length === 0 ? (
          <p className="empty-text">
            You haven’t participated in any hackathons yet.
          </p>
        ) : (
          <div className="hackathon-cards">
            {hackathons.map((hack) => (
              <motion.div
                key={hack._id}
                className="hackathon-card"
                whileHover={{ scale: 1.02 }}
              >
                <div className="hackathon-info">
                  <h4>{hack.name}</h4>
                  <p>{hack.hackathon_type.replace("_", " ").toUpperCase()}</p>
                  <p className="hack-desc">
                    {hack.description.length > 80
                      ? hack.description.slice(0, 80) + "..."
                      : hack.description}
                  </p>
                  <div className="hack-meta">
                    <span>
                      <Clock size={14} />{" "}
                      {new Date(hack.start_date).toLocaleDateString()} -{" "}
                      {new Date(hack.end_date).toLocaleDateString()}
                    </span>
                    <span
                      className={`status-tag ${
                        hack.is_active ? "active" : "ended"
                      }`}
                    >
                      {hack.is_active ? "Active" : "Ended"}
                    </span>
                  </div>
                </div>

                {/* Submission status + score */}
                <div className="hack-footer">
                  {hack.submission?.status === "evaluated" ? (
                    <div className="eval-status">
                      <CheckCircle className="eval-icon" />
                      <span>
                        Evaluated:{" "}
                        {hack.submission.evaluation_result?.final_score
                          ? hack.submission.evaluation_result.final_score.toFixed(
                              2
                            )
                          : "—"}
                      </span>
                    </div>
                  ) : hack.submission?.status === "submitted" ? (
                    <div className="eval-status submitted">
                      <CheckCircle className="submitted-icon" />
                      <span>Submitted (Pending Evaluation)</span>
                    </div>
                  ) : (
                    <div className="eval-status pending">
                      <Clock className="pending-icon" />
                      <span>No submission yet</span>
                    </div>
                  )}

                  <button
                    className={`btn-submit-project ${
                      hack.submission?.status ? "btn-view-submission" : ""
                    }`}
                    onClick={() => handleSubmitRedirect(hack._id)}
                  >
                    <Send size={16} />
                    {hack.submission?.status
                      ? "View Submission"
                      : "Submit Project"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ParticipantDash;
