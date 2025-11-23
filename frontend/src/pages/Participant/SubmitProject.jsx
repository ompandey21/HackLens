import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Github, Loader, CheckCircle } from "lucide-react";
import "./SubmitProject.css";

const SubmitProject = () => {
  const { hackathon_id } = useParams();
  const [hack, setHack] = useState(null);
  const [file, setFile] = useState(null);
  const [dockerfile, setDockerfile] = useState(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt_token");

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/hackathon/${hackathon_id}`);
        setHack(res.data);

        // Check if user already submitted
        const subRes = await axios.get(
          `http://localhost:8000/participant/submission_status/${hackathon_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (subRes.data?.submitted) {
          setExistingSubmission(subRes.data.submission);
        }
      } catch (err) {
        console.error("Failed to fetch hackathon or submission", err);
      }
    };
    fetchHackathon();
  }, [hackathon_id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hack) return;

    const formData = new FormData();
    formData.append("hackathon_type", hack.hackathon_type);

    if (hack.hackathon_type === "ml_hackathon") {
      if (!file) return setMsg("Please upload your model (.onnx).");
      formData.append("model_file", file);
    } else if (hack.hackathon_type === "codeathon") {
      if (!file) return setMsg("Please upload your code file (.zip or source).");
      formData.append("code_file", file);
    } else if (hack.hackathon_type === "hackathon") {
      if (!githubUrl) return setMsg("Please enter your GitHub repo URL.");
      formData.append("github_url", githubUrl);
      if (dockerfile) formData.append("dockerfile", dockerfile);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8000/participant/submit/${hackathon_id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(res.data.message);
      setTimeout(() => navigate("/participant-dashboard"), 2000);
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.detail || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!hack) return <div>Loading hackathon details...</div>;

  return (
    <motion.div
      className="submit-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2>Submit Your Project - {hack.name}</h2>

      {existingSubmission ? (
        <div className="submission-info">
          <h3>✅ You’ve already submitted your project!</h3>
          <div className="submission-card">
            <p><strong>File:</strong> {existingSubmission.submission_filename || "—"}</p>
            {existingSubmission.github_url && (
              <p>
                <strong>GitHub:</strong>{" "}
                <a href={existingSubmission.github_url} target="_blank" rel="noreferrer">
                  {existingSubmission.github_url}
                </a>
              </p>
            )}
            <p>
              <strong>Submitted At:</strong>{" "}
              {new Date(existingSubmission.submitted_at).toLocaleString()}
            </p>
            <p><strong>Status:</strong> {existingSubmission.status}</p>

            {existingSubmission.status === "evaluated" && existingSubmission.evaluation_result && (
              <div className="evaluation-result">
                <h4>🏆 Evaluation Results</h4>
                {hack.hackathon_type === "ml_hackathon" && (
                  <>
                    <p>Accuracy: {existingSubmission.evaluation_result.accuracy}</p>
                    <p>Precision: {existingSubmission.evaluation_result.precision}</p>
                    <p>Recall: {existingSubmission.evaluation_result.recall}</p>
                    <p>F1 Score: {existingSubmission.evaluation_result.f1_score}</p>
                    <p>Final Score: {existingSubmission.evaluation_result.final_combined_score}</p>
                  </>
                )}
                {hack.hackathon_type === "codeathon" && (
                  <>
                    <p>Test Cases Passed: {existingSubmission.evaluation_result.test_cases_passed}</p>
                    <p>Performance: {existingSubmission.evaluation_result.performance}</p>
                    <p>Final Score: {existingSubmission.evaluation_result.final_score}</p>
                  </>
                )}
                {hack.hackathon_type === "hackathon" && (
                  <>
                    <p>Docker Valid: {existingSubmission.evaluation_result.docker_valid ? "Yes" : "No"}</p>
                    <p>Deployment Ready: {existingSubmission.evaluation_result.deployment_ready ? "Yes" : "No"}</p>
                    <p>Final Score: {existingSubmission.evaluation_result.final_score}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <form className="submit-form" onSubmit={handleSubmit}>
          {hack.hackathon_type === "ml_hackathon" && (
            <>
              <label>Upload your model (.onnx)</label>
              <input
                type="file"
                accept=".onnx"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </>
          )}
          {hack.hackathon_type === "codeathon" && (
            <>
              <label>Upload your code file (.zip or source)</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </>
          )}
          {hack.hackathon_type === "hackathon" && (
            <>
              <label>Enter GitHub Repository URL</label>
              <input
                type="url"
                placeholder="https://github.com/username/project"
                onChange={(e) => setGithubUrl(e.target.value)}
              />
              <label>Upload Dockerfile (optional)</label>
              <input
                type="file"
                onChange={(e) => setDockerfile(e.target.files[0])}
              />
            </>
          )}

          <motion.button
            type="submit"
            className="submit-btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            disabled={loading}
          >
            {loading ? <Loader className="spin" /> : <Upload size={18} />}
            {loading ? "Submitting..." : "Submit Project"}
          </motion.button>

          {msg && <p className="status-msg">{msg}</p>}
        </form>
      )}
    </motion.div>
  );
};

export default SubmitProject;
