import { type LinksType } from "../types/UiTypes";
import {
  FaThLarge,
  FaWallet,
  FaFolderPlus,
  FaUser,
  FaSignOutAlt,
  FaPlayCircle,
  FaCalendar,
  FaTv,
  FaCog,
  FaQuestionCircle,
  FaScroll,
} from "react-icons/fa";

const PUBLIC_LINKS: LinksType[] = [
  { label: "home", to: "/" },
  { label: "login", to: "/login" },
  { label: "sign up", to: "/signup" },
  { label: "About us", to: "/about-us" },
  { label: "Contact", to: "/contact" },
];

const PROTECTED_LINKS: LinksType[] = [
  { label: "dashboard", to: "/dashboard", icon: FaThLarge },
  {
    label: "current display",
    to: "/dashboard/current-display",
    icon: FaPlayCircle,
  },
  {
    label: "upload content",
    to: "/dashboard/upload-content",
    icon: FaFolderPlus,
  },
  {
    label: "contents",
    to: "/dashboard/contents",
    icon: FaScroll,
  },
  {
    label: "permissions",
    to: "/dashboard/permissions",
    icon: FaWallet,
    adminOnly: true,
  },
  { label: "calendar", to: "/dashboard/calendar", icon: FaCalendar },
  { label: "default display", to: "/dashboard/default-display", icon: FaTv },

  // { label: "mvle", to: "https://mvle4.mmsu.edu.ph/" },
  // { label: "about", to: "/dashboard/about", icon: FaInfoCircle },
  { label: "profile", to: "/dashboard/account", icon: FaUser },
  { label: "settings", to: "/dashboard/settings", icon: FaCog },
  { label: "log out", to: "/dashboard/logout", icon: FaSignOutAlt },
  { label: "Help", to: "/dashboard/help", icon: FaQuestionCircle },
];

const LINKS_WITH_CHILDREN: string[] = [
  "upload content",
  "contents",
  "profile",
  "permissions",
];

const LINKS = {
  public: PUBLIC_LINKS,
  protected: PROTECTED_LINKS,
};

export { LINKS as default, LINKS_WITH_CHILDREN };
