import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { MailIcon, LockIcon } from "../components/Icons";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });
      if (res.data && res.data.token) {
        login(res.data.token, res.data.role, res.data.name, email.trim());
        toast.success("Welcome back!");
        navigate("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      toast.error(
        err.message || "Login failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p className="text-muted auth-intro">
          Enter your credentials to access your account.
        </p>
        <div className="form-group">
          <label htmlFor="email">
            <MailIcon />
            <span>Email Address</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            <LockIcon />
            <span>Password</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary form-submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Log in →"}
        </button>
        <p className="text-muted auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="link-accent">
            Create one now
          </Link>
        </p>
      </form>
    </div>
  );
}
