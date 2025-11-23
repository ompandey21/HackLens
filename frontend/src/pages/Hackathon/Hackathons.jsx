import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Code2, Cpu, Rocket, Clock, Activity, Loader, AlertCircle, Filter } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./Hackathons.css";

const Hackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded?.role);
      } catch {
        setUserRole(null);
      }
    }

    const fetchHackathons = async () => {
      try {
        const res = await axios.get("http://localhost:8000/hackathon/active");
        setHackathons(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Error fetching hackathons:", err);
        setError("Failed to load hackathons. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case "ml_hackathon":
        return <Cpu className="card-icon ml-icon" />;
      case "codeathon":
        return <Code2 className="card-icon code-icon" />;
      default:
        return <Rocket className="card-icon hack-icon" />;
    }
  };

  const handleFilter = (type) => {
    setFilterType(type);
    if (type === "all") setFiltered(hackathons);
    else setFiltered(hackathons.filter((h) => h.hackathon_type === type));
  };

  return (
    <div className="hackathons-page">
      <div className="hackathons-topbar">
        <h1 className="hackathons-title">Active Hackathons</h1>

        <div className="filter-bar">
          <Filter size={18} />
          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => handleFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="ml_hackathon">ML Hackathon</option>
            <option value="codeathon">Codeathon</option>
            <option value="hackathon">Hackathon</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <Loader size={28} className="spinner" />
          <span>Loading hackathons...</span>
        </div>
      ) : error ? (
        <div className="error-container">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : (
        <motion.div
          className="hackathon-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatePresence>
            {filtered.length === 0 ? (
              <p className="no-hackathons">No hackathons match this filter.</p>
            ) : (
              filtered.map((hack) => (
                <motion.div
                  key={hack._id}
                  className="hackathon-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 180 }}
                  onClick={() => navigate(`/hackathons/${hack._id}`)}
                >
                  <div className="card-header">
                    {getTypeIcon(hack.hackathon_type)}
                    <h2 className="card-title">{hack.name}</h2>
                  </div>

                  <p className="card-description">{hack.description}</p>

                  <div className="card-footer">
                    <div className="footer-item">
                      <Calendar size={16} />
                      <span>
                        {new Date(hack.start_date).toLocaleDateString()} →{" "}
                        {new Date(hack.end_date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="footer-item">
                      <Activity size={16} />
                      <span>{hack.is_active ? "Active" : "Inactive"}</span>
                    </div>

                    <div className="footer-item created-by">
                      <Clock size={16} />
                      <span>By {hack.created_by}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Hackathons;
