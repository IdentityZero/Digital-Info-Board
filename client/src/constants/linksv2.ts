import {
  FaBell,
  FaCalendar,
  FaCheck,
  FaCloud,
  FaCog,
  FaEnvelopeOpenText,
  FaFolderPlus,
  FaImage,
  FaPlayCircle,
  FaQuestionCircle,
  FaScroll,
  FaSignOutAlt,
  FaSitemap,
  FaThLarge,
  FaTimes,
  FaTv,
  FaUser,
  FaUserPlus,
  FaUsers,
  FaVideo,
  FaWallet,
} from "react-icons/fa";
import { MenuType } from "../types/Links";

export const LINKSV2: MenuType[] = [
  { label: "dashboard", to: "/dashboard", icon: FaThLarge },
  {
    label: "notifications",
    to: "/dashboard/notifications",
    icon: FaBell,
    mobileOnly: true,
  },
  {
    label: "current display",
    to: "/dashboard/current-display",
    icon: FaPlayCircle,
  },
  {
    label: "upload content",
    to: "/dashboard/upload-content",
    icon: FaFolderPlus,
    children: [
      { label: "video", to: "/dashboard/upload-content/video", icon: FaVideo },
      { label: "image", to: "/dashboard/upload-content/image", icon: FaImage },
      {
        label: "text",
        to: "/dashboard/upload-content/text",
        icon: FaEnvelopeOpenText,
      },
    ],
  },
  {
    label: "contents",
    to: "/dashboard/contents",
    icon: FaScroll,
    children: [
      { label: "video", to: "/dashboard/contents/video", icon: FaVideo },
      { label: "image", to: "/dashboard/contents/image", icon: FaImage },
      {
        label: "text",
        to: "/dashboard/contents/text",
        icon: FaEnvelopeOpenText,
      },
    ],
  },
  {
    label: "permissions",
    to: "/dashboard/permissions",
    icon: FaWallet,
    adminOnly: true,
    children: [
      {
        label: "active",
        to: "/dashboard/permissions/active",
        icon: FaCheck,
        adminOnly: true,
      },
      {
        label: "inactive",
        to: "/dashboard/permissions/inactive",
        icon: FaTimes,
        adminOnly: true,
      },
    ],
  },
  {
    label: "default display",
    to: "/dashboard/default-display",
    icon: FaTv,
    children: [
      {
        label: "settings",
        to: "/dashboard/default-display/settings",
        icon: FaCog,
      },
      {
        label: "organization",
        to: "/dashboard/default-display/organization",
        icon: FaSitemap,
      },
      {
        label: "events",
        to: "/dashboard/default-display/events",
        icon: FaCalendar,
      },
      {
        label: "media",
        to: "/dashboard/default-display/media",
        icon: FaPlayCircle,
      },
      {
        label: "weather",
        to: "/dashboard/default-display/forecast",
        icon: FaCloud,
      },
    ],
  },
  { label: "calendar", to: "/dashboard/calendar", icon: FaCalendar },
  {
    label: "profile",
    to: "/dashboard/account",
    icon: FaUser,
    children: [
      {
        label: "my profile",
        to: "/dashboard/account/my-profile",
        icon: FaUser,
      },
      {
        label: "new users",
        to: "/dashboard/account/new-users",
        icon: FaUserPlus,
        adminOnly: true,
      },
      {
        label: "accounts list",
        to: "/dashboard/account/list-of-accounts",
        icon: FaUsers,
        adminOnly: true,
      },
    ],
  },
  { label: "settings", to: "/dashboard/settings", icon: FaCog },
  { label: "log out", to: "/dashboard/logout", icon: FaSignOutAlt },
  { label: "Help", to: "/dashboard/help", icon: FaQuestionCircle },
];
