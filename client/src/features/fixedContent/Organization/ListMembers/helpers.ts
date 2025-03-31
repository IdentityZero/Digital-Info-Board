export type OrgMemberErrorsState = {
  name: string | string[];
  image: string | string[];
  position: string | string[];
};

export const orgMemberInitError: OrgMemberErrorsState = {
  name: "",
  image: "",
  position: "",
};
