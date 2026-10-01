import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  LogoIcon,
  EventsIcon,
  BookingsIcon,
  AdminIcon,
  CalendarIcon,
  LoginIcon,
  RegisterIcon,
  LogoutIcon,
  SunIcon,
  MoonIcon,
  MenuIcon,
  CloseIcon,
} from "./Icons";
export default function Navbar() {
  const { user, logout, setIsPageLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };
  const handleEventBookClick = () => {
    setIsPageLoading(true);
    setMobileMenuOpen(false);
    setTimeout(() => setIsPageLoading(false), 800);
  };
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };
  const isActive = (path) => {
    if (path === "/") {
      return (
        location.pathname === "/" || location.pathname.startsWith("/listings/")
      );
    }
    return location.pathname === path;
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const navLinks = [
    {
      to: "/",
      label: "Events",
      icon: <EventsIcon />,
    },
    ...(user
      ? [
          {
            to: "/my-bookings",
            label: "My Bookings",
            icon: <BookingsIcon />,
          },
        ]
      : []),
    ...(user?.role === "ADMIN"
      ? [
          {
            to: "/admin",
            label: "Admin",
            icon: <AdminIcon />,
          },
        ]
      : []),
    {
      to: "/calendar",
      label: "Calendar",
      icon: <CalendarIcon />,
    },
  ];
  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo" onClick={handleEventBookClick}>
            <LogoIcon className="logo-icon" />
            EventBook
          </Link>
        </div>
        <div className="nav-links desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? "active" : ""}`}
              onClick={handleNavClick}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle Theme"
            title={
              theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
            }
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
          {user ? (
            <button onClick={handleLogout} className="btn btn-secondary">
              <LogoutIcon />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-secondary"
                onClick={handleNavClick}
              >
                <LoginIcon />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                onClick={handleNavClick}
              >
                <RegisterIcon />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
        <div className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? "active" : ""}`}
              onClick={handleNavClick}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className="theme-toggle mobile-theme-toggle"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <>
                <MoonIcon />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <SunIcon />
                <span>Light Mode</span>
              </>
            )}
          </button>
          {user ? (
            <button onClick={handleLogout} className="btn btn-secondary">
              <LogoutIcon />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-secondary"
                onClick={handleNavClick}
              >
                <LoginIcon />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                onClick={handleNavClick}
              >
                <RegisterIcon />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </nav>
      {showBackToTop && (
        <button
          className="back-to-top visible"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>
      )}
    </>
  );
}
