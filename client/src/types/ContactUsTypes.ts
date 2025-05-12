import { FullUserType } from "./UserTypes";

export type CreateContactUsMessageType = {
  name: string;
  email: string;
  message: string;
};

export type ContactUsMessageType = CreateContactUsMessageType & {
  id: number;
  is_responded: boolean;
  responded_by: FullUserType;
  responded_at: string;
  created_at: string;
};
