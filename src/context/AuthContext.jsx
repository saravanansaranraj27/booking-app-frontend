/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function getInitialAuthState() {
  try {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");

    if (token && stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to restore authentication:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialAuthState);
  const [isBooking, setIsBooking] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const login = (token, role, name, email) => {
    const userData = {
      role,
      name,
      email,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading: false,
        isBooking,
        setIsBooking,
        isPageLoading,
        setIsPageLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
