import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Shield,
  Loader2,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import "./Login.css";

// Utility function for password strength
const checkPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  return {
    score: strength,
    label: strength <= 1 ? "Weak" : strength <= 3 ? "Medium" : "Strong",
    color: strength <= 1 ? "#ef4444" : strength <= 3 ? "#f59e0b" : "#10b981",
  };
};

// Input Component
const InputField = ({
  icon: Icon,
  type,
  name,
  placeholder,
  value,
  onChange,
  error,
  onFocus,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="input-wrapper">
      <div className={`input-container ${error ? "error" : ""}`}>
        <Icon className="input-icon" size={20} />
        <input
          type={inputType}
          name = {name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className="input-field"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="error-message"
        >
          {error}
        </motion.span>
      )}
    </div>
  );
};

// Password Strength Indicator
const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const strength = checkPasswordStrength(password);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="password-strength"
    >
      <div className="strength-bars">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className="strength-bar"
            style={{
              background: level <= strength.score ? strength.color : "#1e293b",
            }}
          />
        ))}
      </div>
      <span style={{ color: strength.color }} className="strength-label">
        {strength.label}
      </span>
    </motion.div>
  );
};

// Role Selector Component
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

// Main Auth Component
const HackLensAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate(); // ✅ inside your component

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "participant",
  });

  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Full name is required";
    }

    if (!isLogin && !formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isLogin && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!isLogin && !formData.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        // Prepare login data
        const loginData = new URLSearchParams();
        loginData.append("username", formData.username);
        loginData.append("password", formData.password);

        // --- DEBUGGING START ---
        console.log("Attempting login with:", {
          username: formData.username,
          password: formData.password,
        });
        // --- DEBUGGING END ---

        const response = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: loginData,
        });
        
        // --- DEBUGGING START ---
        console.log("API Response Status:", response.status);
        // --- DEBUGGING END ---

        if (!response.ok) {
          const errorData = await response.json();
         
          throw new Error(errorData.detail || "Login failed");
        }

        const data = await response.json();
       
        
        const jwtToken = data.access_token;
        if (!jwtToken) {
            console.error("No access_token found in response!");
            throw new Error("Login response did not include an access token.");
        }

        // Decode JWT to extract role
        const payload = JSON.parse(atob(jwtToken.split(".")[1]));
        
        
        const userRole = payload.role; // <-- This is a likely failure point
        
        -

        localStorage.setItem("jwt_token", jwtToken);
        localStorage.setItem("user_role", userRole);

        const redirectMap = {
          participant: "/dashboard/participant",
          judge: "/dashboard/judge",
          admin: "/dashboard/admin",
        };
        
        const redirectUrl = "/hackathons" // Get URL from map
        
        // --- !! IMPORTANT FIX !! ---
        // Add this check to prevent a silent error if the role is missing or invalid
        if (redirectUrl) {
            console.log("Redirecting to:", redirectUrl);
            navigate(redirectUrl, { replace: true });
        } else {
            console.error(`Invalid or missing role: '${userRole}'. Cannot redirect.`);
            throw new Error(`Your user role ('${userRole}') is not valid for redirection.`);
        }
        
      } else {
        // Signup
        console.log(formData)
        let req = JSON.stringify({
              name: formData.fullName,
              username: formData.username,
              email: formData.email,
              password: formData.password,
              role: formData.role,
            });
        console.log(req);
        try {
          const response = await fetch("http://localhost:8000/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.fullName,
              username: formData.username,
              email: formData.email,
              password: formData.password,
              role: formData.role,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            // Handle structured FastAPI errors
            let errorMessage = "Signup failed.";

            if (Array.isArray(data.detail)) {
              // e.g. [{"msg": "Email already registered"}]
              errorMessage = data.detail.map((err) => err.msg).join(", ");
            } else if (typeof data.detail === "string") {
              errorMessage = data.detail;
            }

            throw new Error(errorMessage);
          }

  
          navigate("/auth");
        } catch (error) {
          console.error("Signup error:", error);
          setErrors({
            general:
              error.message || "Authentication failed. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setErrors({
        general: error.message || "Authentication failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "participant",
    });
  };

  return (
    <div className="auth-container">
      {/* Left Side - Branding */}
      <motion.div
        className="auth-branding"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="branding-content">
          
          <h2 className="branding-title">
            The AI-Powered
            <br />
            <span className="highlight">Hackathon Judge</span>
          </h2>
          <p className="branding-subtitle">
            A comprehensive evaluation system for credible hackathon judging
            using advanced AI algorithms
          </p>

          <div className="feature-grid">
            {[
              { icon: "💻", label: "Code Analysis" },
              { icon: "💡", label: "Innovation" },
              { icon: "🎯", label: "Impact" },
              { icon: "📊", label: "Scoring" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <span className="feature-icon">{feature.icon}</span>
                <span className="feature-label">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side - Auth Form */}
      <motion.div
        className="auth-form-section"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="form-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="form-title">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="form-subtitle">
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Sign up to start evaluating hackathon projects"}
              </p>

              <div className="auth-form">
                {!isLogin && (
                    <>
                  <InputField
                    icon={User}
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    error={errors.fullName}
                    onFocus={() => setFocusedField("fullName")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <InputField
                  icon={Mail}
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={errors.email}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
                  
                    </>
                )}

                
                <InputField
                    icon={User}
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    error={errors.username}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                  />

                <InputField
                  icon={Lock}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  error={errors.password}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />

                {!isLogin && (
                  <>
                    <PasswordStrength password={formData.password} />

                    <InputField
                      icon={Lock}
                      type="password"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      error={errors.confirmPassword}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                    />

                    <RoleSelector
                      selected={formData.role}
                      onChange={(role) => handleInputChange("role", role)}
                      error={errors.role}
                    />
                  </>
                )}

                {isLogin && (
                  <div className="form-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Remember me</span>
                    </label>
                    <a href="#" className="forgot-password">
                      Forgot Password?
                    </a>
                  </div>
                )}

                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="general-error"
                  >
                    <X size={16} />
                    {errors.general}
                  </motion.div>
                )}

                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  className="submit-button"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="spinner" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      {isLogin ? "Sign In" : "Create Account"}
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>

                <div className="form-footer">
                  <span>
                    {isLogin
                      ? "Don't have an account?"
                      : "Already have an account?"}
                  </span>
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="toggle-button"
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default HackLensAuth;
