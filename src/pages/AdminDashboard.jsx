import { useEffect, useState } from "react";
import AdminUsers from "../components/AdminUsers";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  EditIcon,
  TrashIcon,
  CalendarIcon,
  DollarIcon,
  SlotsIcon,
  LoadingSpinner,
} from "../components/Icons";
const emptyForm = {
  title: "",
  description: "",
  category: "workshop",
  price: "",
  date: "",
  slotsAvailable: "",
};
export default function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const loadListings = () => {
    setLoading(true);
    api
      .get("/listings")
      .then((res) => {
        setListings(res.data);
      })
      .catch(() => {
        toast.error("Failed to load listings");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    let cancelled = false;
    api
      .get("/listings")
      .then((res) => {
        if (!cancelled) {
          setListings(res.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Failed to load listings");
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
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      slotsAvailable: parseInt(form.slotsAvailable, 10),
    };
    try {
      if (editingId) {
        await api.put(`/listings/${editingId}`, payload);
        toast.success("Listing updated successfully!");
      } else {
        await api.post("/listings", payload);
        toast.success("Listing created successfully!");
      }
      resetForm();
      loadListings();
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };
  const handleEdit = (listing) => {
    setEditingId(listing.id);
    setForm({
      title: listing.title,
      description: listing.description,
      category: listing.category,
      price: String(listing.price),
      date: listing.date,
      slotsAvailable: String(listing.slotsAvailable),
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }
    try {
      await api.delete(`/listings/${id}`);
      toast.success("Listing deleted successfully");
      loadListings();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };
  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Listing" : "Create New Listing"}</h2>
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            id="title"
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Event Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="workshop">Workshop</option>
            <option value="conference">Conference</option>
            <option value="concert">Concert</option>
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="slotsAvailable">Total Slots</label>
            <input
              id="slotsAvailable"
              name="slotsAvailable"
              type="number"
              placeholder="0"
              value={form.slotsAvailable}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : editingId
                ? "Update Listing"
                : "Create Listing"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      <h2>Manage All Listings</h2>
      {loading ? (
        <div className="loading-container">
          <LoadingSpinner className="initial-loader" />
        </div>
      ) : listings.length === 0 ? (
        <p className="admin-empty-state text-muted">
          No listings found. Create your first event above!
        </p>
      ) : (
        <div className="admin-list">
          {listings.map((l) => (
            <div key={l.id} className="admin-row">
              <div>
                <strong>{l.title}</strong>
                <span className="card-badge admin-listing-badge">
                  {l.category}
                </span>
                <p className="admin-row-meta">
                  <DollarIcon className="icon-sm" />${l.price} ·{" "}
                  <CalendarIcon className="icon-sm" />
                  {new Date(l.date).toLocaleDateString()} ·{" "}
                  <SlotsIcon className="icon-sm" />
                  {l.slotsAvailable} slots
                </p>
              </div>
              <div className="admin-row-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(l)}
                >
                  <EditIcon />
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(l.id)}
                >
                  <TrashIcon />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <AdminUsers />
    </div>
  );
}
