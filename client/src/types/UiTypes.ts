import { IconType } from "react-icons";

type LinksType = {
  label: string;
  to: string;
  icon?: IconType;
  adminOnly?: boolean;
};

export type { LinksType };
