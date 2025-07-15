"use client";
import { EventType, useEvents } from "@/contexts/EventContext";
import { useState } from "react";

export default function FilterBar({ onFilter }: { onFilter: (filtered: EventType[]) => void }) {
  const { events } = useEvents();

  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("startDate");

  const handleFilter = () => {
    let result = [...events];

    if (search.trim()) {
      result = result.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (eventType) {
      result = result.filter(e => e.eventType === eventType);
    }

    if (category) {
      result = result.filter(e => e.category === category);
    }

    if (sortBy === "startDate") {
      result.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
    } else if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    onFilter(result);
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-6 bg-white rounded-xl shadow p-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 transition w-full sm:w-auto"
      />

      <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 transition w-full sm:w-auto">
        <option value="">All Types</option>
        <option value="Online">Online</option>
        <option value="In-Person">In-Person</option>
      </select>

      <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 transition w-full sm:w-auto">
        <option value="">All Categories</option>
        <option value="Conference">Conference</option>
        <option value="Meetup">Meetup</option>
        <option value="Workshop">Workshop</option>
        <option value="Webinar">Webinar</option>
      </select>

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 transition w-full sm:w-auto">
        <option value="startDate">Sort by Start Date</option>
        <option value="title">Sort by Title</option>
      </select>

      <button
        onClick={handleFilter}
        className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-150 shadow w-full sm:w-auto"
      >
        Apply Filters
      </button>
    </div>
  );
}
