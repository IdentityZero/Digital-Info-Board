const step1FormNames = [
  "first_name",
  "last_name",
  "profile",
  "invitation_code",
];
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
  invitation_code: string | string[];
  profile: {
    id_number: string | string[];
    birthdate: string | string[];
    role: string | string[];
    position: string | string[];
    image: string | string[];
  };
};

export const newUserErrorInitialState: NewUserErrorsType = {
  username: "",
  password: "",
  repeat_password: "",
  first_name: "",
  last_name: "",
  invitation_code: "",
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
  invitation_code: string;
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
  invitation_code: "",
  profile: {
    id_number: "",
    birthdate: "",
    role: "",
    position: "",
    image: null,
  },
};

export const handleDurationInputs = (text: string): string => {
  if (text.length === 9) return text.slice(0, -1);

  const lastChar: any = text.slice(-1);
  if (isNaN(lastChar)) {
    return text.slice(0, -1);
  }

  if (text.length === 2 || text.length === 5) {
    return text + ":";
  }

  return text;
};
