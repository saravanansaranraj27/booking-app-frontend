import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CalendarIcon, LoadingSpinner } from "../components/Icons";
export default function CalendarView() {
  const [listings, setListings] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
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
          toast.error("Failed to load events");
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
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };
  const getEventsForDay = (day) => {
    if (!day) return [];
    return listings.filter((listing) => {
      const listingDate = new Date(listing.date + "T00:00:00");
      return listingDate.toDateString() === day.toDateString();
    });
  };
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };
  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };
  if (loading) {
    return (
      <div className="page">
        <h1>Event Calendar</h1>
        <div className="loading-container">
          <LoadingSpinner className="initial-loader" />
        </div>
      </div>
    );
  }
  return (
    <div className="page">
      <h1>Event Calendar</h1>
      <div className="calendar-container">
        <div className="calendar-navigation">
          <button className="btn btn-secondary" onClick={prevMonth}>
            ← Previous
          </button>
          <h2 className="calendar-title">
            <CalendarIcon className="icon-md" />
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <button className="btn btn-secondary" onClick={nextMonth}>
            Next →
          </button>
        </div>
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
          {getDaysInMonth(currentMonth).map((day, index) => {
            const events = getEventsForDay(day);
            const isToday =
              day && day.toDateString() === new Date().toDateString();
            return (
              <div
                key={index}
                className={`calendar-day ${!day ? "empty" : ""} ${isToday ? "today" : ""}`}
              >
                {day && (
                  <>
                    <div className="calendar-day-number">{day.getDate()}</div>
                    {events.slice(0, 2).map((event) => (
                      <Link
                        key={event.id}
                        to={`/listings/${event.id}`}
                        className="calendar-event"
                      >
                        {event.title}
                      </Link>
                    ))}
                    {events.length > 2 && (
                      <div className="calendar-more">
                        +{events.length - 2} more
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
