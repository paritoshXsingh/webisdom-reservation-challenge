export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Site {
  _id: string;
  name: string;
  description: string;
}

export interface TimeSlot {
  _id: string;
  siteId: string;
  date: string;
  startTime: string;
  capacity: number;
  availableTickets: number;
}