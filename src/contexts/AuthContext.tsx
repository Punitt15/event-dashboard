"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { User, AuthContextType } from "@/types/auth";
import { getItem, setItem, removeItem } from "@/utils/storage";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext)!;

const SECRET_KEY = process.env.NEXT_PUBLIC_AUTH_SECRET || "default_dev_secret";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const encryptedUser = getItem<string>("auth_user");
    if (encryptedUser) {
      try {
        const parsed = typeof encryptedUser === "string" ? JSON.parse(encryptedUser) : encryptedUser;
        const bytes = CryptoJS.AES.decrypt(parsed.password, SECRET_KEY);
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
        setUser({ email: parsed.email, password: decryptedPassword });
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const isEncrypted = (str: string) => str.startsWith("U2Fsd");

  const signup = (newUser: User) => {
    const encryptedUsers = getItem<string>("users");
    let users: User[] = [];
    if (encryptedUsers) {
      try {
        const parsedUsers = typeof encryptedUsers === "string" ? JSON.parse(encryptedUsers) : encryptedUsers;
        users = parsedUsers.map((u: User) => ({
          email: u.email,
          password: isEncrypted(u.password)
            ? CryptoJS.AES.decrypt(u.password, SECRET_KEY).toString(CryptoJS.enc.Utf8)
            : u.password,
        }));
      } catch (e) {
        users = [];
      }
    }
    if (users.find((u: User) => u.email === newUser.email)) return false;
    const updatedUsers = [...users, newUser];
    const usersToSave = updatedUsers.map(u => ({
      email: u.email,
      password: CryptoJS.AES.encrypt(u.password, SECRET_KEY).toString(),
    }));
    setItem("users", usersToSave);
    setItem("auth_user", {
      email: newUser.email,
      password: CryptoJS.AES.encrypt(newUser.password, SECRET_KEY).toString(),
    });
    setUser(newUser);
    return true;
  };

  const login = (loginUser: User) => {
    const encryptedUsers = getItem<string>("users");
    let users: User[] = [];
    if (encryptedUsers) {
      try {
        const parsedUsers = typeof encryptedUsers === "string" ? JSON.parse(encryptedUsers) : encryptedUsers;
        users = parsedUsers.map((u: User) => ({
          email: u.email,
          password: isEncrypted(u.password)
            ? CryptoJS.AES.decrypt(u.password, SECRET_KEY).toString(CryptoJS.enc.Utf8)
            : u.password,
        }));
      } catch (e) {
        users = [];
      }
    }
    const found = users.find(
      (u: User) => u.email === loginUser.email && u.password === loginUser.password
    );
    if (found) {
      setItem("auth_user", {
        email: found.email,
        password: CryptoJS.AES.encrypt(found.password, SECRET_KEY).toString(),
      });
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    removeItem("auth_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
