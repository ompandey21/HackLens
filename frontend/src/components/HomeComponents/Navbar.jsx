import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Menu, X, User, LayoutGrid, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // track scroll for sticky bg
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // decode JWT if exists
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          username: decoded?.sub,
          role: decoded?.role,
        });
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleLogin = () => navigate("/auth");
  const handleProfile = () => navigate("/me");
  const handleRoute = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };
  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setUser(null);
    navigate("/auth");
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.nav
      className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="navbar-container">
        {/* Brand */}
        <motion.div
          className="navbar-brand"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleRoute("/")}
          style={{ cursor: "pointer" }}
        >
          <Eye className="logo-icon" />
          <span className="brand-text">HackLens</span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <motion.button
            className="nav-link"
            onClick={() => handleRoute("/hackathons")}
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            <Rocket size={16} /> Hackathons
          </motion.button>

          {user && (
            <motion.button
              className="nav-link"
              onClick={() => {
                if (!user) return navigate("/auth");
                const role = user.role?.toLowerCase();
                if (role === "admin") navigate("/dashboard/admin");
                else if (role === "judge") navigate("/dashboard/judge");
                else if (role === "participant")
                  navigate("/dashboard/participant");
                else navigate("/dashboard");
              }}
              variants={itemVariants}
              whileHover={{ y: -2 }}
            >
              <LayoutGrid size={16} /> Dashboard
            </motion.button>
          )}

          <motion.a
            href="#about"
            className="nav-link"
            variants={itemVariants}
            whileHover={{ y: -2 }}
          >
            About
          </motion.a>

          {/* Login / Profile */}
          {!user ? (
            <motion.button
              className="login-button"
              onClick={handleLogin}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: "0 8px 25px rgba(14, 165, 233, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
          ) : (
            <>
              <motion.button
                className="profile-button"
                onClick={handleProfile}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 8px 25px rgba(6, 182, 212, 0.35)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <User size={18} />
                <span>{user.username}</span>
              </motion.button>
              <motion.button
                className="logout-button"
                onClick={handleLogout}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 8px 25px rgba(239,68,68,0.35)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Logout
              </motion.button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <motion.div
            animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="mobile-nav-link"
              onClick={() => handleRoute("/hackathons")}
            >
              Hackathons
            </button>

            {user && (
              <button
                className="mobile-nav-link"
                onClick={() => handleRoute("/dashboard")}
              >
                Dashboard
              </button>
            )}

            <a
              href="#about"
              className="mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>

            {!user ? (
              <button
                className="mobile-login-button"
                onClick={() => {
                  handleLogin();
                  setIsMobileMenuOpen(false);
                }}
              >
                Login
              </button>
            ) : (
              <>
                <button
                  className="mobile-profile-button"
                  onClick={() => handleRoute("/me")}
                >
                  <User size={18} /> {user.username}
                </button>
                {user && (
                  <button
                    className="mobile-logout-button"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
