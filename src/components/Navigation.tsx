"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex gap-4 p-4 bg-gray-100">
      {user ? (
        <>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/create-event">Create Event</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
}
