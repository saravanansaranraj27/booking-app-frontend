import { Link } from "react-router-dom";
import { CalendarIcon, DollarIcon, SlotsIcon } from "./Icons";
export default function ListingCard({ listing }) {
  const eventDate = new Date(listing.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <Link to={`/listings/${listing.id}`} className="card">
      <div className="card-badge">{listing.category}</div>
      <h3>{listing.title}</h3>
      <p className="card-desc">{listing.description}</p>
      <div className="listing-card-date">
        <CalendarIcon className="icon-sm" />
        {eventDate}
      </div>
      <div className="card-footer">
        <span>
          <DollarIcon className="icon-sm" />${listing.price}
        </span>
        <span>
          <SlotsIcon className="icon-sm" />
          {listing.slotsAvailable} slots left
        </span>
      </div>
    </Link>
  );
}
