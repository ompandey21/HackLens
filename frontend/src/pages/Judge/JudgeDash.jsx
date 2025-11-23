import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Eye,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Github,
  BarChart3,
  Brain,
} from "lucide-react";
import "./JudgeDash.css";

const TeamCard = ({ submission, onEvaluate }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "evaluated":
        return <CheckCircle size={18} className="status-icon scored" />;
      case "submitted":
        return <Clock size={18} className="status-icon pending" />;
      default:
        return <AlertCircle size={18} className="status-icon in-review" />;
    }
  };

  const getStatusClass = (status) => `status-badge ${status}`;

  return (
    <motion.div
      className="team-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="team-card-header">
        <div>
          <h3 className="team-name">{submission.participant}</h3>
          <p className="project-title">
            {submission.hackathon_type.replace("_", " ").toUpperCase()}
          </p>
        </div>
        <div className={getStatusClass(submission.status)}>
          {getStatusIcon(submission.status)}
          <span>{submission.status}</span>
        </div>
      </div>

      <div className="team-card-body">
        {submission.submission_link && (
          <div className="team-links">
            <a
              href={submission.submission_link}
              target="_blank"
              rel="noopener noreferrer"
              className="link-button"
            >
              <Github size={16} />
            </a>
          </div>
        )}
        <div className="last-updated">
          Submitted at:{" "}
          {new Date(submission.submitted_at).toLocaleString("en-IN")}
        </div>
      </div>

      {submission.status !== "evaluated" ? (
        <div className="team-card-footer">
          <button className="btn-primary" onClick={() => onEvaluate(submission)}>
            Evaluate
          </button>
        </div>
      ) : (
        <div className="evaluation-result">
          <h4>✅ Evaluation Result</h4>
          {submission.hackathon_type === "ml_hackathon" && (
            <>
              <p>Accuracy: {submission.evaluation_result?.accuracy}</p>
              <p>Precision: {submission.evaluation_result?.precision}</p>
              <p>Recall: {submission.evaluation_result?.recall}</p>
              <p>F1 Score: {submission.evaluation_result?.f1_score}</p>
              <p>Final Combined: {submission.evaluation_result?.final_combined_score}</p>
            </>
          )}
          {submission.hackathon_type === "codeathon" && (
            <>
              <p>Test Cases Passed: {submission.evaluation_result?.test_cases_passed}</p>
              <p>Performance: {submission.evaluation_result?.performance}</p>
              <p>Final Score: {submission.evaluation_result?.final_score}</p>
            </>
          )}
          {submission.hackathon_type === "hackathon" && (
            <>
              <p>Docker Valid: {submission.evaluation_result?.docker_valid ? "✅ Yes" : "❌ No"}</p>
              <p>Deployment Ready: {submission.evaluation_result?.deployment_ready ? "✅ Yes" : "❌ No"}</p>
              <p>Final Score: {submission.evaluation_result?.final_score}</p>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};


const QuickStats = ({ stats }) => (
  <div className="quick-stats">
    <div className="stat-card">
      <div className="stat-icon scored">
        <CheckCircle size={24} />
      </div>
      <div className="stat-content">
        <div className="stat-value">{stats.evaluated}</div>
        <div className="stat-label">Evaluated</div>
      </div>
    </div>
    <div className="stat-card">
      <div className="stat-icon pending">
        <Clock size={24} />
      </div>
      <div className="stat-content">
        <div className="stat-value">{stats.submitted}</div>
        <div className="stat-label">Pending</div>
      </div>
    </div>
    <div className="stat-card">
      <div className="stat-icon total">
        <BarChart3 size={24} />
      </div>
      <div className="stat-content">
        <div className="stat-value">{stats.total}</div>
        <div className="stat-label">Total Submissions</div>
      </div>
    </div>
    <div className="stat-card">
      <div className="stat-icon avg">
        <Brain size={24} />
      </div>
      <div className="stat-content">
        <div className="stat-value">{stats.avgScore}</div>
        <div className="stat-label">Avg Score</div>
      </div>
    </div>
  </div>
);

const JudgeDash = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("jwt_token");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get("http://localhost:8000/judge/assigned", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [token]);

  const handleEvaluate = async (submission) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/judge/evaluate/${submission._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Evaluation complete!");
      setSubmissions((prev) =>
        prev.map((s) =>
          s._id === submission._id
            ? { ...s, status: "evaluated", evaluation_result: res.data.result }
            : s
        )
      );
    } catch (err) {
      console.error("Evaluation failed:", err);
      alert("❌ Evaluation failed.");
    }
  };

  const stats = {
    evaluated: submissions.filter((s) => s.status === "evaluated").length,
    submitted: submissions.filter((s) => s.status === "submitted").length,
    total: submissions.length,
    avgScore:
      submissions.filter((s) => s.evaluation_result)?.reduce((acc, s) => {
        return acc + (s.evaluation_result?.final_score || 0);
      }, 0) / (submissions.filter((s) => s.evaluation_result).length || 1),
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    if (!value) return setFiltered(submissions);
    setFiltered(
      submissions.filter(
        (s) =>
          s.participant.toLowerCase().includes(value) ||
          s.hackathon_type.toLowerCase().includes(value)
      )
    );
  };

  if (loading) return <div className="judge-dashboard">Loading...</div>;

  return (
    <div className="judge-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="welcome-section">
            <h2 className="page-title">Judge Dashboard</h2>
            <p className="page-subtitle">
              Review and evaluate submitted hackathon projects
            </p>
          </div>

          <QuickStats stats={stats} />

          <div className="filter-search-section">
            <div className="search-bar">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search submissions..."
                onChange={handleSearch}
                value={search}
                className="search-input"
              />
            </div>
          </div>

          <div className="teams-section">
            <div className="section-header">
              <h3>All Submissions</h3>
              <span className="team-count">{filtered.length} entries</span>
            </div>

            <div className="teams-grid">
              {filtered.map((s) => (
                <TeamCard
                  key={s._id}
                  submission={s}
                  onEvaluate={handleEvaluate}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeDash;
