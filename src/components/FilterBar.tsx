"use client";
import { EventType, useEvents } from "@/contexts/EventContext";
import { useState } from "react";
import { categories, eventTypes, sortOptions } from "@/constants/constants";

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
        {eventTypes.map((type: string) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 transition w-full sm:w-auto">
        <option value="">All Categories</option>
        {categories.map((cat: string) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 transition w-full sm:w-auto">
        {sortOptions.map((option: { value: string; label: string }) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
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
