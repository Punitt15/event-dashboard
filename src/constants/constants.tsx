// src/constants/constants.tsx

export const categories: string[] = [
  "Conference",
  "Meetup",
  "Workshop",
  "Webinar",
];

export const eventTypes: string[] = [
  "Online",
  "In-Person",
];

export const sortOptions: { value: string; label: string }[] = [
  { value: "startDate", label: "Sort by Start Date" },
  { value: "title", label: "Sort by Title" },
]; 