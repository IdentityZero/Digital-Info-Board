import { Delta } from "quill/core";
import { ListType } from "./ListType";

export type AnnouncementTypes = "video" | "text" | "image" | "urgent";

export type AuthorType = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  profile: {
    id: string;
    birthdate: string;
    id_number: string;
    image: string;
    position: string;
    role: string;
  };
};

// Create Base Announcement Type
export type AnnouncementCreateType = {
  title: Delta | string;
  start_date: string;
  end_date: string;
};

export type BaseAnnouncementType = AnnouncementCreateType & {
  id: string;
  position: number;
  last_modified: string;
  created_at: string;
  url?: string;
  is_active: boolean;
};

export type FullBaseAnnouncementType = BaseAnnouncementType & {
  author: AuthorType;
};

// Bare Create Text Announcement Type
export type TextAnnouncementCreateType = {
  details: Delta | string;
  duration?: string | null;
};

// Create Text Announcement Type with Base Announcement
export type CreateTextAnnouncementT = AnnouncementCreateType & {
  text_announcement: TextAnnouncementCreateType;
};

// Retrieved Data from API Text Type
export type TextAnnouncementType = TextAnnouncementCreateType & {
  id: string;
  last_modified: string;
  created_at: string;
  url?: string;
};

// Retrieved Data from API Type with full information
export type FullTextAnnouncementType = BaseAnnouncementType & {
  text_announcement: TextAnnouncementType;
  author: AuthorType;
};

// Bare Create Image Announcement Type
export type ImageAnnouncementCreateType = {
  image: string | File;
  duration?: string;
};

// Create Image Announcement Type with Base Announcement
export type CreateImageAnnouncementT = AnnouncementCreateType & {
  image_announcement: ImageAnnouncementCreateType[];
};

// Retrieved Data from API Image type
export type ImageAnnouncementType = ImageAnnouncementCreateType & {
  id: string;
  last_modified: string;
  created_at: string;
  url?: string;
  file_size: number;
};

// Image Announcement Type with Base and author
export type FullImageAnnouncementType = BaseAnnouncementType & {
  image_announcement: ImageAnnouncementType[];
  author: AuthorType;
};

// Bare Create Video Announcement Type
export type VideoAnnouncementCreateType = {
  video: string | File;
  duration: string;
};

export type CreateVideoAnnouncementT = AnnouncementCreateType & {
  video_announcement: VideoAnnouncementCreateType[];
};

// Retrieved Data from API Image type
export type VideoAnnouncementType = VideoAnnouncementCreateType & {
  id: string;
  last_modified: string;
  created_at: string;
  url?: string;
  file_size: number;
};

export type FullVideoAnnouncementType = BaseAnnouncementType & {
  video_announcement: VideoAnnouncementType[];
  author: AuthorType;
};

export type AnnouncementRetrieveType = BaseAnnouncementType & {
  author: AuthorType;
  text_announcement?: TextAnnouncementType;
  image_announcement?: ImageAnnouncementType[];
  video_announcement?: VideoAnnouncementType[];
};

export type AnnouncementListType = AnnouncementRetrieveType[];
export type PaginatedAnnouncementListTypeV1 =
  ListType<AnnouncementRetrieveType>;

export type CreateUrgentAnnouncementType = {
  title: Delta;
  description: Delta;
  duration: string;
};

export type UrgentAnnouncementType = {
  id: number;
  title: Delta;
  description: Delta;
  duration: string;
  author: AuthorType;
  last_modified: string;
  created_at: string;
  is_approved: boolean;
};

export type NonUrgentAnnouncementType = AnnouncementRetrieveType & {
  type: "non-urgent";
};

export type UrgentAnnouncementTypeWithType = UrgentAnnouncementType & {
  type: "urgent";
};

export type AnnouncementTypeWithUrgency =
  | NonUrgentAnnouncementType
  | UrgentAnnouncementTypeWithType;
