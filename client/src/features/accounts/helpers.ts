export type UserInformationErrorT = {
  last_name: string | string[];
  first_name: string | string[];
  profile: {
    id_number: string | string[];
    birthdate: string | string[];
    image: string | string[];
  };
};

export const UserInformationErrorState = {
  first_name: "",
  last_name: "",
  profile: {
    id_number: "",
    birthdate: "",
    image: "",
  },
};
