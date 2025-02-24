import { FullUserType } from "./UserTypes";

export type NotificationType = {
  id: number;
  created_by?: FullUserType;
  message: string;
  is_read: boolean;
  created_at: string;
  action?: "approve_announcement";
  target_id?: number;
};

export type NotificationListType = {
  count: number;
  next: string | null;
  results: NotificationType[];
  unread_count: number;
};
