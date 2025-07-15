"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EventList from "@/components/EventList";
import FilterBar from "@/components/FilterBar";
import { EventType, useEvents } from "@/contexts/EventContext";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { events } = useEvents();
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="min-h-[94vh] flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 to-blue-100 px-2 py-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 drop-shadow-sm">Welcome, {user.email}</h1>
        <FilterBar onFilter={setFilteredEvents} />
        <EventList customEvents={filteredEvents} />
      </div>
    </div>
  );
}
