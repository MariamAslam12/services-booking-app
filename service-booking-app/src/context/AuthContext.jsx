import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("app_user");
    return saved ? JSON.parse(saved) : null; // Defaults to null if not logged in
  });

  const switchRole = (newRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem("app_user", JSON.stringify(updated));
  };

  const logout = () => {
    localStorage.removeItem("app_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);