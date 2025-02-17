import { FullUserType } from "./UserTypes";

export type NotificationType = {
  id: number;
  created_by: FullUserType;
  message: string;
  is_read: boolean;
  created_at: string;
};
