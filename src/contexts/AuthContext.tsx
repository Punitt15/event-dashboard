"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";

type User = {
  email: string;
  password: string;
};

interface AuthContextType {
  user: User | null;
  signup: (user: User) => boolean;
  login: (user: User) => boolean;
  logout: () => void;
  loading: boolean;
}

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
        const bytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setUser(decrypted);
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
        const bytes = CryptoJS.AES.decrypt(encryptedUsers, SECRET_KEY);
        users = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (e) {
        users = [];
      }
    }
    if (users.find((u: User) => u.email === newUser.email)) return false;
    users.push(newUser);
    const encryptedUsersToSave = CryptoJS.AES.encrypt(JSON.stringify(users), SECRET_KEY).toString();
    localStorage.setItem("users", encryptedUsersToSave);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(newUser), SECRET_KEY).toString();
    localStorage.setItem("auth_user", encrypted);
    setUser(newUser);
    return true;
  };

  const login = (loginUser: User) => {
    const encryptedUsers = localStorage.getItem("users");
    let users: User[] = [];
    if (encryptedUsers) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedUsers, SECRET_KEY);
        users = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (e) {
        users = [];
      }
    }
    const found = users.find(
      (u: User) => u.email === loginUser.email && u.password === loginUser.password
    );
    if (found) {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(found), SECRET_KEY).toString();
      localStorage.setItem("auth_user", encrypted);
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
