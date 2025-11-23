import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader, AlertCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";

import "./HackathonDetails.css";
import HeroBanner from "../../components/HackathonComponents/HeroBanner";
import AboutCard from "../../components/HackathonComponents/AboutCard";
import CountdownTimer from "../../components/HackathonComponents/CountDownTimer";
import InfoSidebar from "../../components/HackathonComponents/InfoSidebar";
import ActionBar from "../../components/HackathonComponents/ActionBar";
import RegisterModal from "../../components/HackathonComponents/RegisterModal";

const HackathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hack, setHack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const role = useMemo(() => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded?.role || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchHack = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/hackathon/${id}`);
        if (mounted) setHack(res.data);

        const token = localStorage.getItem("jwt_token");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            if (decoded?.role === "participant") {
              const reg = await axios.get(
                `http://localhost:8000/hackathon/is_registered/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (mounted) setRegistered(reg.data.registered);
            }
          } catch (err) {
            console.warn("Could not fetch registration status", err);
          }
        }
      } catch (e) {
        if (mounted) setErr("Failed to load hackathon details.");
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchHack();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    } catch {
      alert("Failed to copy link.");
    }
  };

  const handleRegister = () => setRegisterOpen(true);
  const handleRegisterConfirm = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) throw new Error("No token found");

      const res = await axios.post(
        `http://localhost:8000/hackathon/register/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRegistered(true);
      setRegisterOpen(false);
      setToast({ show: true, message: res.data.message, type: "success" });

      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    } catch (err) {
      console.error("Registration failed:", err);
      setToast({
        show: true,
        message: err.response?.data?.detail || "Failed to register.",
        type: "error",
      });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-loading">
          <Loader className="spin" />
          <span>Loading hackathon…</span>
        </div>
      </div>
    );
  }

  if (err || !hack) {
    return (
      <div className="details-page">
        <div className="details-error">
          <AlertCircle />
          <span>{err || "Not found."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">
      <motion.div
        className="details-container"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <HeroBanner
          name={hack.name}
          type={hack.hackathon_type}
          active={hack.is_active}
          createdBy={hack.created_by}
          createdAt={hack.created_at}
          onBack={() => navigate(-1)}
          onShare={handleShare}
        />

        <div className="details-layout">
          <div className="left-col">
            <AboutCard description={hack.description} />
            {/* Rules placeholder — replace with real content when you have it */}
            <AboutCard
              icon="rules"
              title="Rules & Guidelines"
              description={`• Follow event code of conduct.\n• Respect timelines & submission formats.\n• Plagiarism or cheating leads to disqualification.\n• Decisions by judges are final.\n• Keep it clean, keep it classy.`}
            />
          </div>

          <div className="right-col">
            <CountdownTimer start={hack.start_date} end={hack.end_date} />
            <InfoSidebar
              start={hack.start_date}
              end={hack.end_date}
              type={hack.hackathon_type}
              createdBy={hack.created_by}
              isActive={hack.is_active}
              participantsCount={null} // Placeholder until integrated
              registrationDeadline={null} // Placeholder
            />
          </div>
        </div>

        <ActionBar
          role={role}
          onBack={() => navigate(-1)}
          onRegister={handleRegister}
          onEdit={() => navigate(`/edit-hackathon/${hack._id}`)} // placeholder
          onManage={() => navigate(`/manage/${hack._id}`)} // placeholder
          onEvaluate={() => navigate(`/evaluate/${hack._id}`)} // placeholder
          registered={registered}
        />
      </motion.div>

      <RegisterModal
        open={registerOpen}
        name={hack.name}
        start={hack.start_date}
        end={hack.end_date}
        onCancel={() => setRegisterOpen(false)}
        onConfirm={handleRegisterConfirm}
      />
      {toast.show && (
        <motion.div
          className={`toast ${toast.type}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {toast.message}
        </motion.div>
      )}
    </div>
  );
};

export default HackathonDetails;
