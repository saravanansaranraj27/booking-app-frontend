import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import CalendarView from "./pages/CalendarView";
import BookingConfirmation from "./pages/BookingConfirmation";
import { LoadingSpinner } from "./components/Icons";
import "./index.css";

function GlobalLoader() {
  const { isBooking } = useAuth();

  if (!isBooking) return null;

  return (
    <div className="global-overlay">
      <div className="global-loader-content">
        <LoadingSpinner className="initial-loader" />
        <p>Processing your booking...</p>
      </div>
    </div>
  );
}

function PageLoader() {
  const { isPageLoading } = useAuth();

  if (!isPageLoading) return null;

  return (
    <div className="initial-loading">
      <LoadingSpinner className="initial-loader" />
    </div>
  );
}

function InitialLoader() {
  const { isLoading } = useAuth();

  if (!isLoading) return null;

  return (
    <div className="initial-loading">
      <LoadingSpinner className="initial-loader" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <InitialLoader />
        <GlobalLoader />
        <PageLoader />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            className: "toast",
            success: {
              className: "toast toast-success",
              iconTheme: {
                primary: "var(--success)",
                secondary: "var(--card-bg-solid)",
              },
            },
            error: {
              className: "toast toast-error",
              iconTheme: {
                primary: "var(--danger)",
                secondary: "var(--card-bg-solid)",
              },
            },
          }}
        />

        <Navbar />

        <Routes>
          <Route path="/" element={<Listings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/calendar" element={<CalendarView />} />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/booking-confirmation/:id"
            element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
