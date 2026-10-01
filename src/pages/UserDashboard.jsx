import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import api from "../api/axios";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  DollarIcon,
  CheckIcon,
  LoadingSpinner,
} from "../components/Icons";
export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, past: 0 });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    api
      .get("/bookings/my")
      .then((res) => {
        if (cancelled) return;
        setBookings(res.data);
        const now = new Date();
        setStats({
          total: res.data.length,
          upcoming: res.data.filter((b) => new Date(b.listing.date) > now)
            .length,
          past: res.data.filter((b) => new Date(b.listing.date) <= now).length,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);
  if (loading) {
    return (
      <div className="page">
        <h1>Welcome back, {user?.name}!</h1>
        <div className="loading-container">
          <LoadingSpinner className="initial-loader" />
        </div>
      </div>
    );
  }
  return (
    <div className="page">
      <h1>Welcome back, {user?.name}!</h1>
      <div className="dashboard-stats-grid">
        <div className="card dashboard-stat-card">
          <h3 className="dashboard-stat-value dashboard-stat-total">
            {stats.total}
          </h3>
          <p className="dashboard-stat-label">Total Bookings</p>
        </div>
        <div className="card dashboard-stat-card">
          <h3 className="dashboard-stat-value dashboard-stat-upcoming">
            {stats.upcoming}
          </h3>
          <p className="dashboard-stat-label">Upcoming Events</p>
        </div>
        <div className="card dashboard-stat-card">
          <h3 className="dashboard-stat-value dashboard-stat-past">
            {stats.past}
          </h3>
          <p className="dashboard-stat-label">Past Events</p>
        </div>
      </div>
      <h2>Upcoming Events</h2>
      {bookings.filter((b) => new Date(b.listing.date) > new Date()).length ===
      0 ? (
        <p className="empty-state dashboard-empty-state">
          No upcoming events. <Link to="/">Browse events</Link> to book one!
        </p>
      ) : (
        <div className="dashboard-bookings-grid">
          {bookings
            .filter(
              (b) =>
                new Date(b.listing.date) > new Date() &&
                b.status === "CONFIRMED",
            )
            .map((booking) => (
              <Link
                key={booking.id}
                to={`/listings/${booking.listing.id}`}
                className="card"
              >
                <div className="card-badge">{booking.listing.category}</div>
                <h3>{booking.listing.title}</h3>
                <p className="booking-row-detail">
                  <CalendarIcon className="icon-sm" />
                  {new Date(booking.listing.date).toLocaleDateString()}
                </p>
                <div className="card-footer">
                  <span>
                    <DollarIcon className="icon-sm" />${booking.listing.price}
                  </span>
                  <span className="status-tag confirmed">
                    <CheckIcon className="icon-sm" />
                    {booking.status}
                  </span>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
