const step1FormNames = ["first_name", "last_name", "profile"];
export const step2FormNames = ["username", "password", "repeat_password"];

export function step1HasErrors(obj: any) {
  return step1FormNames.some((name) => name in obj);
}

export type NewUserErrorsType = {
  username: string | string[];
  password: string | string[];
  repeat_password: string | string[];
  first_name: string | string[];
  last_name: string | string[];
  profile: {
    id_number: string | string[];
    birthdate: string | string[];
    role: string | string[];
    position: string | string[];
  };
};

export const newUserErrorInitialState = {
  username: "",
  password: "",
  repeat_password: "",
  first_name: "",
  last_name: "",
  profile: {
    id_number: "",
    birthdate: "",
    role: "",
    position: "",
    image: "",
  },
};

export type NewUserObjectType = {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  profile: {
    id_number: string;
    birthdate: string;
    role: string;
    position: string;
    image: File | null;
  };
};

export const newUserObject: NewUserObjectType = {
  username: "",
  password: "",
  first_name: "",
  last_name: "",
  profile: {
    id_number: "",
    birthdate: "",
    role: "",
    position: "",
    image: null,
  },
};
