export type UserInformationErrorT = {
  username: string | string[];
  last_name: string | string[];
  first_name: string | string[];
  profile: {
    id_number: string | string[];
    birthdate: string | string[];
    image: string | string[];
  };
};

export const UserInformationErrorState = {
  username: "",
  first_name: "",
  last_name: "",
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
