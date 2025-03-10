import { jwtDecode } from "jwt-decode";
import { ListType } from "./ListType";

//#region: Student and All Student Positions should match
export type Student = {
  role: "student";
  position: "president" | "vice_president" | "secretary" | "treasurer";
};
export type AllStudentPositions = [
  "president",
  "vice_president",
  "secretary",
  "treasurer"
];

//#endregion

//#region: Faculty and All Faculty Positions should match
export type Faculty = {
  role: "faculty";
  position:
    | "department_head"
    | "organizational_adviser"
    | "faculty_staff"
    | "professor";
};

export type AllFacultyPositions = [
  "department_head",
  "faculty_staff",
  "organizational_adviser",
  "professor"
];

//#endregion

export type Role = Student | Faculty;

type BaseUser = {
  id: string;
  username: string;
  token: string;
  is_admin: boolean;
};

export type User = BaseUser & Role;

export type DecodedJWTType = Role & {
  user_id: string;
  username: string;
  exp: number;
  is_admin: boolean;
};

export const decodeUserJWT = (token: string): User | null => {
  const decodedJWT = jwtDecode<DecodedJWTType>(token);

  let user: User | null = null;

  if (decodedJWT.role === "faculty") {
    user = {
      role: decodedJWT.role,
      position: decodedJWT.position as Faculty["position"],
      id: decodedJWT.user_id,
      username: decodedJWT.username,
      token: token,
      is_admin: decodedJWT.is_admin,
    };
  } else if (decodedJWT.role === "student") {
    user = {
      role: decodedJWT.role,
      position: decodedJWT.position as Student["position"],
      id: decodedJWT.user_id,
      username: decodedJWT.username,
      is_admin: decodedJWT.is_admin,
      token: token,
    };
  }

  return user;
};

type UserProfileType = {
  id: string;
  id_number: string;
  role: Role["role"];
  position: Role["position"];
  birthdate: string;
  image: string | File;
  is_admin: boolean;
};

export type FullUserType = {
  id: string;
  username: string;
  last_name: string;
  first_name: string;
  is_active: boolean;
  profile: UserProfileType;
};

export type ListUserType = ListType<FullUserType>;
export const listUserInitState: ListUserType = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};

export type CreateUserInvitationType = {
  email: string;
  role: Role["role"];
  position: Role["position"];
};

export type RetrieveUserInvitationType = {
  id: number;
  email: string;
  role: Role["role"];
  position: Role["position"];
  is_used: boolean;
  is_email_sent: boolean;
};

export type ListUserInvitationType = ListType<RetrieveUserInvitationType>;
export const listUserInvitationInitState: ListUserInvitationType = {
  count: 0,
  next: null,
  previous: null,
  results: [],
};
