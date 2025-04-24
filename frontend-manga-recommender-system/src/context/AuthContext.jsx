import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate loading or fetch user from localStorage/API
    const timer = setTimeout(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(storedUser);
        console.log("User found in localStorage:", storedUser);
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, isLoggedIn, user, setUser, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
