"use client";
import { EventType, useEvents } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const EventList = ({ customEvents }: { customEvents: EventType[] }) => {
  const { deleteEvent } = useEvents();
  const { user } = useAuth();

  const userEvents = customEvents && customEvents.filter((event) => event.organizer === user?.email);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-4 text-blue-700">Your Events</h1>

      {userEvents.length === 0 ? (
        <p className="text-gray-500 text-center">No events created yet.</p>
      ) : (
        <ul className="space-y-6">
          {userEvents.map(event => (
            <li
              key={event.id}
              className="bg-white border border-gray-100 shadow-md rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-transform hover:scale-[1.02] hover:shadow-lg"
            >
              <div>
                <h2 className="font-bold text-lg text-blue-800 mb-1">{event.title}</h2>
                <p className="text-sm text-gray-600">
                  {new Date(event.startDateTime).toLocaleString()} - {new Date(event.endDateTime).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Link
                  href={`/edit-event/${event.id}`}
                  className="px-4 py-1 rounded-lg bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this event?")) {
                      deleteEvent(event.id);
                    }
                  }}
                  className="px-4 py-1 rounded-lg bg-red-100 text-red-600 font-medium hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
