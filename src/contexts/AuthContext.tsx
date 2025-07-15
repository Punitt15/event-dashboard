"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { User, AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext)!;

const SECRET_KEY = process.env.NEXT_PUBLIC_AUTH_SECRET || "default_dev_secret";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const encryptedUser = localStorage.getItem("auth_user");
    if (encryptedUser) {
      try {
        const parsed = JSON.parse(encryptedUser);
        const bytes = CryptoJS.AES.decrypt(parsed.password, SECRET_KEY);
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
        setUser({ email: parsed.email, password: decryptedPassword });
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const signup = (newUser: User) => {
    const encryptedUsers = localStorage.getItem("users");
    let users: User[] = [];
    if (encryptedUsers) {
      try {
        users = JSON.parse(encryptedUsers).map((u: User) => ({
          email: u.email,
          password: CryptoJS.AES.decrypt(u.password, SECRET_KEY).toString(CryptoJS.enc.Utf8),
        }));
      } catch (e) {
        users = [];
      }
    }
    if (users.find((u: User) => u.email === newUser.email)) return false;
    // Encrypt only the password
    const encryptedPassword = CryptoJS.AES.encrypt(newUser.password, SECRET_KEY).toString();
    const userToSave = { email: newUser.email, password: encryptedPassword };
    const updatedUsers = [...users, userToSave];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("auth_user", JSON.stringify(userToSave));
    setUser(newUser);
    return true;
  };

  const login = (loginUser: User) => {
    const encryptedUsers = localStorage.getItem("users");
    let users: User[] = [];
    if (encryptedUsers) {
      try {
        users = JSON.parse(encryptedUsers).map((u: User) => ({
          email: u.email,
          password: CryptoJS.AES.decrypt(u.password, SECRET_KEY).toString(CryptoJS.enc.Utf8),
        }));
      } catch (e) {
        users = [];
      }
    }
    const found = users.find(
      (u: User) => u.email === loginUser.email && u.password === loginUser.password
    );
    if (found) {
      // Encrypt only the password for storage
      const encryptedPassword = CryptoJS.AES.encrypt(found.password, SECRET_KEY).toString();
      const userToSave = { email: found.email, password: encryptedPassword };
      localStorage.setItem("auth_user", JSON.stringify(userToSave));
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
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
