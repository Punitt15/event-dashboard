"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  return (
    <nav className={"sticky top-0 z-20 w-full bg-white/80 backdrop-blur shadow-md rounded-b-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-4"}>
      <div className="flex gap-4 items-center w-full sm:w-auto">
        <Link href="/" className="text-xl font-bold text-blue-700 hover:text-blue-900 transition">EventDash</Link>
      </div>
      <div className="flex gap-3 items-center w-full sm:w-auto justify-end">
        {user ? (
          <>
            <Link href="/dashboard" className="px-3 py-1 rounded-lg text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition">Dashboard</Link>
            <Link href="/create-event" className="px-3 py-1 rounded-lg text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition">Create Event</Link>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-lg bg-red-100 text-red-600 font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 transition cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="px-3 py-1 rounded-lg text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition">Login</Link>
            <Link href="/signup" className="px-3 py-1 rounded-lg text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
