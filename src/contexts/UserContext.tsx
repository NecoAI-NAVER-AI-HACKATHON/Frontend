import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserService, type UserResponse } from "@/lib/services/userService";

interface UserContextType {
  user: UserResponse | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    // Check if user has a token
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userData = await UserService.getProfile();
      setUser(userData);
    } catch (err: any) {
      console.error("Error fetching user profile:", err);
      const status = err.response?.status;
      const errorMessage = err.message || "Failed to fetch user profile";
      setError(errorMessage);
      
      // Only clear token on 401 Unauthorized, not on 500 server errors
      if (status === 401) {
        console.warn("Unauthorized - clearing token and user");
        localStorage.removeItem("access_token");
        setUser(null);
      } else if (status === 500) {
        // Server error - don't clear user or token, just show error
        console.error("Server error (500) when fetching user profile. Token is still valid.");
        // Keep the user state as-is, don't clear it
      } else {
        // Other errors - keep user state, don't clear token
        console.warn(`Error fetching user profile (${status}):`, errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearUser = () => {
    setUser(null);
    setError(null);
  };

  // Fetch user profile on mount if token exists
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        fetchUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

