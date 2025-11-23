import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


/**
 * ProtectedRoute
 * @param {ReactNode} children - component to render
 * @param {string} userType - expected role, e.g. "admin", "participant", etc.
 */
const ProtectedRoute = ({ children, userType }) => {
  const token = localStorage.getItem("jwt_token");

  // No token = unauthenticated
  if (!token) {
    console.warn("🚫 Token not found");
    return <Navigate to="/auth" replace />;
  }

  try {
    // Decode token payload
    const decoded = jwtDecode(token);
    const role = decoded?.role;

    // If token doesn’t have role or mismatch
    if (!role || (userType && role !== userType)) {
      console.warn(`🚫 Unauthorized: Expected ${userType}, got ${role}`);
      return <Navigate to="/auth" replace />;
    }

    // Token and role valid → allow access
    return children;
  } catch (error) {
    console.error("⚠️ Invalid token:", error);
    return <Navigate to="/auth" replace />;
  }
};

export default ProtectedRoute;

