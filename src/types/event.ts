export type EventType = {
  id: string;
  title: string;
  description: string;
  eventType: "Online" | "In-Person";
  location?: string;
  eventLink?: string;
  startDateTime: string;
  endDateTime: string;
  category: string;
  organizer: string;
};

export interface EventContextType {
  events: EventType[];
  addEvent: (event: Omit<EventType, "id">) => boolean;
  updateEvent: (event: EventType) => boolean;
  deleteEvent: (id: string) => void;
} 