import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "./Icons";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="protected-loading">
        <LoadingSpinner className="protected-loader" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}
