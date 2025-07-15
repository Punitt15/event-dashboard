"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  email: string;
  password: string;
};

interface AuthContextType {
  user: User | null;
  signup: (user: User) => boolean;
  login: (user: User) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext)!;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const signup = (newUser: User) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u: User) => u.email === newUser.email)) return false;
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const login = (loginUser: User) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(
      (u: User) => u.email === loginUser.email && u.password === loginUser.password
    );
    if (found) {
      localStorage.setItem("auth_user", JSON.stringify(found));
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
