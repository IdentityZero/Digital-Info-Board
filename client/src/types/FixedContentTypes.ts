export type OrganizationMembersType = {
  id: number;
  name: string;
  position: string;
  image: string;
  priority: number;
};

export type UpcomingEventType = {
  id: number;
  name: string;
  date: string;
};

export type MediaDisplayType = {
  id: number;
  name: string;
  file: string;
  file_size: number;
  type: "video" | "image";
};

export type CalendarEventType = {
  id: number;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
};
