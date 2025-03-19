import { IconType } from "react-icons";

export type MenuType = {
  label: string;
  to: string;
  icon?: IconType;
  adminOnly?: boolean;
  children?: MenuType[];
};
