import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ListingCard from "../components/ListingCard";
import toast from "react-hot-toast";
import {
  SearchIcon,
  FilterIcon,
  SortIcon,
  CalendarIcon,
} from "../components/Icons";
export default function Listings() {
  const [listings, setListings] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(true);
  const handleCategoryChange = (e) => {
    setLoading(true);
    setCategory(e.target.value);
  };
  useEffect(() => {
    api
      .get("/listings", {
        params: category ? { category } : {},
      })
      .then((res) => {
        setListings(res.data);
      })
      .catch(() => {
        toast.error("Failed to load events");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category]);
  const filteredAndSortedListings = useMemo(() => {
    let result = [...listings];
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(lowerSearch) ||
          l.description.toLowerCase().includes(lowerSearch),
      );
    }
    result.sort((a, b) => {
      if (sortBy === "price-low") {
        return a.price - b.price;
      }
      if (sortBy === "price-high") {
        return b.price - a.price;
      }
      if (sortBy === "date") {
        return new Date(a.date) - new Date(b.date);
      }
      return 0;
    });
    return result;
  }, [listings, search, sortBy]);
  return (
    <div className="page">
      <div className="listings-header">
        <h1>Browse Events</h1>
        <Link
          to="/calendar"
          className="btn btn-secondary listings-calendar-link"
        >
          <CalendarIcon className="icon-sm" />
          Calendar View
        </Link>
      </div>
      <div className="listing-filters">
        <div className="listing-filter listing-filter-search">
          <SearchIcon className="icon-sm listing-filter-icon" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="listing-filter-control"
          />
        </div>
        <div className="listing-filter">
          <FilterIcon className="icon-sm listing-filter-icon" />
          <select
            value={category}
            onChange={handleCategoryChange}
            className="listing-filter-control"
          >
            <option value="">All Categories</option>
            <option value="workshop">Workshop</option>
            <option value="conference">Conference</option>
            <option value="concert">Concert</option>
          </select>
        </div>
        <div className="listing-filter">
          <SortIcon className="icon-sm listing-filter-icon" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="listing-filter-control"
          >
            <option value="date">Sort by: Date</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
      {loading ? null : filteredAndSortedListings.length === 0 ? (
        <div className="empty-state listings-empty-state">
          <h3>No events found</h3>
          <p>Try adjusting your search or category filters.</p>
          <button
            className="btn btn-secondary empty-state-action"
            onClick={() => {
              setSearch("");
              setCategory("");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="listing-grid">
          {filteredAndSortedListings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
