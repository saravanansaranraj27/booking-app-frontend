import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  CalendarIcon,
  DollarIcon,
  SlotsIcon,
  LoadingSpinner,
} from "../components/Icons";

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, setIsBooking } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch(() => toast.error("Failed to load event details"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsBooking(true);
    try {
      await api.post("/bookings", { listingId: parseInt(id) });
      toast.success("Booking confirmed successfully!");
      navigate("/my-bookings");
    } catch (err) {
      toast.error(err.message || "Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="page centered-state">
        <LoadingSpinner className="initial-loader" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="page centered-state">
        <h2>Event not found</h2>
        <p className="text-muted">
          The event you're looking for doesn't exist.
        </p>
        <button
          className="btn btn-primary centered-state-action"
          onClick={() => navigate("/")}
        >
          Browse Events
        </button>
      </div>
    );
  }

  const isSoldOut = listing.slotsAvailable <= 0;

  return (
    <div className="page detail-page">
      <span className="detail-category">{listing.category}</span>
      <div className="detail-date">
        <CalendarIcon className="icon-md" />
        {new Date(listing.date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </div>
      <h1>{listing.title}</h1>
      <p>{listing.description}</p>
      <div className="booking-cta">
        <div>
          <div className="price-tag">
            <DollarIcon className="icon-md" />${listing.price}
          </div>
          <div className="slots-tag">
            {isSoldOut ? (
              <>No slots remaining</>
            ) : (
              <>
                <SlotsIcon className="icon-sm" />
                {listing.slotsAvailable} slots available
              </>
            )}
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleBook}
          disabled={isSoldOut}
        >
          {isSoldOut ? "Sold Out" : "Book Now →"}
        </button>
      </div>
    </div>
  );
}
