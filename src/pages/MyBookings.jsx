import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { CalendarIcon, DollarIcon, TrashIcon } from "../components/Icons";
export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => {
    setLoading(true);
    api
      .get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    let cancelled = false;
    api
      .get("/bookings/my")
      .then((res) => {
        if (!cancelled) {
          setBookings(res.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Failed to load bookings");
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
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      await api.delete(`/bookings/${id}`);
      toast.success("Booking cancelled successfully.");
      load();
    } catch (err) {
      toast.error(err.message || "Failed to cancel booking.");
    }
  };
  if (loading) {
    return (
      <div className="page">
        <h1>My Bookings</h1>
      </div>
    );
  }
  return (
    <div className="page">
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="empty-state dashboard-empty-state">
          <p>You haven't booked any events yet.</p>
          <Link to="/" className="btn btn-primary centered-state-action">
            Browse Events
          </Link>
        </div>
      ) : (
        bookings.map((b) => (
          <div key={b.id} className="booking-row">
            <div>
              <strong>{b.listing.title}</strong>
              <div className="booking-row-meta">
                <span className={`status-tag ${b.status.toLowerCase()}`}>
                  {b.status}
                </span>
                <span className="booking-row-detail">
                  <CalendarIcon className="icon-sm" />
                  {new Date(b.listing.date).toLocaleDateString()}
                </span>
                <span className="booking-row-detail">
                  <DollarIcon className="icon-sm" />${b.listing.price}
                </span>
              </div>
            </div>
            {b.status === "CONFIRMED" && (
              <button
                className="btn btn-danger"
                onClick={() => handleCancel(b.id)}
              >
                <TrashIcon />
                Cancel
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
