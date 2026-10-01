import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import {
  CheckIcon,
  CalendarIcon,
  DollarIcon,
  BookingsIcon,
  EventsIcon,
} from "../components/Icons";
export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/bookings/my")
      .then((res) => {
        const found = res.data.find((b) => b.listing.id === parseInt(id));
        if (found) {
          setBooking(found);
        } else {
          navigate("/");
        }
      })
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);
  if (loading) return <div className="page">Loading...</div>;
  if (!booking) return null;
  return (
    <div className="page booking-confirmation-page">
      <div className="booking-confirmation-banner">
        <CheckIcon className="icon-xl" />
        <h2>Booking Confirmed!</h2>
      </div>
      <div className="card booking-confirmation-card">
        <h3>{booking.listing.title}</h3>
        <p>
          <strong>Category:</strong> {booking.listing.category}
        </p>
        <p>
          <CalendarIcon className="icon-sm" />
          <strong>Date:</strong>{" "}
          {new Date(booking.listing.date).toLocaleDateString()}
        </p>
        <p>
          <DollarIcon className="icon-sm" />
          <strong>Price:</strong> ${booking.listing.price}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`status-tag ${booking.status.toLowerCase()}`}>
            {booking.status}
          </span>
        </p>
        <p>
          <strong>Booking ID:</strong> #{booking.id}
        </p>
      </div>
      <div className="booking-confirmation-actions">
        <Link to="/my-bookings" className="btn btn-primary">
          <BookingsIcon />
          View My Bookings
        </Link>
        <Link to="/" className="btn btn-secondary">
          <EventsIcon />
          Browse More Events
        </Link>
      </div>
    </div>
  );
}
