import { Role } from "../../types/UserTypes";

export type UserInformationErrorT = {
  username: string | string[];
  last_name: string | string[];
  first_name: string | string[];
  email: string | string[];
  profile: {
    id_number: string | string[];
    birthdate: string | string[];
    image: string | string[];
  };
};

export const UserInformationErrorState: UserInformationErrorT = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  profile: {
    id_number: "",
    birthdate: "",
    image: "",
  },
};

export type ChangePasswordErrorT = {
  old_password: string | string[];
  password: string | string[];
  password2: string | string[];
};

export const ChangePasswordErrorState: ChangePasswordErrorT = {
  old_password: "",
  password: "",
  password2: "",
};

export const CreateInvitationFormDataInitialState: {
  email: string;
  role: Role["role"] | "";
  position: Role["position"] | "";
} = {
  email: "",
  role: "",
  position: "",
};

export type CreateInvitationErrorT = {
  email: string | string[];
  role: string | string[];
  position: string | string[];
};

export const CreateInvitationErrorInitialState: CreateInvitationErrorT = {
  email: "",
  role: "",
  position: "",
};
