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

export interface AddOrUpdateEventResult {
  success: boolean;
  overlappingEvent?: EventType;
}

export interface EventContextType {
  events: EventType[];
  addEvent: (event: Omit<EventType, "id">) => AddOrUpdateEventResult;
  updateEvent: (event: EventType) => AddOrUpdateEventResult;
  deleteEvent: (id: string) => void;
} 