import { jwtDecode } from "jwt-decode";

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
  id: number;
  username: string;
  token: string;
};

export type User = BaseUser & Role;

type DecodedJWTType = Role & {
  user_id: number;
  username: string;
  exp: number;
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
    };
  } else if (decodedJWT.role === "student") {
    user = {
      role: decodedJWT.role,
      position: decodedJWT.position as Student["position"],
      id: decodedJWT.user_id,
      username: decodedJWT.username,
      token: token,
    };
  }

  return user;
};
