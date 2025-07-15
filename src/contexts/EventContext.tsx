"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { EventType, EventContextType } from "@/types/event";

const EventContext = createContext<EventContextType | null>(null);

export const useEvents = () => useContext(EventContext)!;

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("events");
    if (stored) setEvents(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const addEvent = (event: Omit<EventType, "id">) => {
    const newEvent = { ...event, id: uuidv4() };

    // Overlap Check
    if (events.some((e) => isOverlap(e, newEvent))) return false;

    setEvents([...events, newEvent]);
    return true;
  };

  const updateEvent = (updatedEvent: EventType) => {
    const withoutCurrent = events.filter(e => e.id !== updatedEvent.id);

    if (withoutCurrent.some(e => isOverlap(e, updatedEvent))) return false;

    setEvents(withoutCurrent.concat(updatedEvent));
    return true;
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};

// Utility Function for Overlap Check
function isOverlap(a: EventType, b: EventType) {
  const startA = new Date(a.startDateTime).getTime();
  const endA = new Date(a.endDateTime).getTime();
  const startB = new Date(b.startDateTime).getTime();
  const endB = new Date(b.endDateTime).getTime();

  return startA < endB && startB < endA;
}
