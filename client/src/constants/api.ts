import {
  type Student,
  type Faculty,
  type AllStudentPositions,
  type AllFacultyPositions,
  Role,
} from "../types/UserTypes";

const get_student_positions = (_role: Student["role"]): AllStudentPositions => {
  return [
    "president",
    "vice_president",
    "secretary",
    "treasurer",
    "public_information_officer",
  ];
};

const get_faculty_positions = (_role: Faculty["role"]): AllFacultyPositions => {
  return [
    "department_head",
    "faculty_staff",
    "organizational_adviser",
    "professor",
  ];
};

export const get_role_positions = (
  role: Role["role"]
): Student["position"][] | Faculty["position"][] => {
  if (role === "student") {
    return get_student_positions(role);
  } else if (role === "faculty") {
    return get_faculty_positions(role);
  } else {
    return [];
  }
};

export const MAX_IMAGE_SIZE = 10485760; // 10MB
export const MAX_VIDEO_SIZE = 209715200; // 200MB
