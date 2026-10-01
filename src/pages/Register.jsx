import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { UserIcon, MailIcon, LockIcon } from "../components/Icons";
export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
      });
      if (res.data && res.data.token) {
        login(res.data.token, res.data.role, res.data.name, form.email.trim());
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p className="text-muted auth-intro">
          Join us and start booking amazing events today.
        </p>
        <div className="form-group">
          <label htmlFor="name">
            <UserIcon />
            Full Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            autoComplete="name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">
            <MailIcon />
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            <LockIcon />
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary form-submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Register →"}
        </button>
        <p className="text-muted auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="link-accent">
            Log in here
          </Link>
        </p>
      </form>
    </div>
  );
}
