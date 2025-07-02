import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

 const login = (token, user) => {
  if (!user || typeof user !== 'object') {
    console.error("Invalid user object during login:", user);
    toast.error("Failed to log in. Please try again.");
    return;
  }

  const normalizedUser = {
    ...user,
    id: user._id || user.id,
  };

  setToken(token);
  setUser(normalizedUser);
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(normalizedUser));
};

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("You have been logged out successfully!");
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing stored user:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
