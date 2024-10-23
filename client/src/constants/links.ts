import { type LinksType } from "../types/UiTypes";

const PUBLIC_LINKS: LinksType[] = [
  { label: "home", to: "/" },
  { label: "login", to: "/login" },
  { label: "sign up", to: "/signup" },
];

const PROTECTED_LINKS: LinksType[] = [
  { label: "dashboard", to: "/dashboard" },
  { label: "upload content", to: "/dashboard/upload-content" },
  { label: "permissions", to: "/dashboard/permissions" },
  { label: "mvle", to: "https://mvle4.mmsu.edu.ph/" },
  { label: "about", to: "/dashboard/about" },
  { label: "account", to: "/dashboard/account" },
  { label: "log out", to: "/dashboard/logout" },
];

const LINKS = {
  public: PUBLIC_LINKS,
  protected: PROTECTED_LINKS,
};

export default LINKS;
