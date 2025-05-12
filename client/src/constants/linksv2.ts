import {
  FaBell,
  FaCalendar,
  FaCheck,
  FaCog,
  FaEnvelope,
  FaEnvelopeOpenText,
  FaFolderPlus,
  FaImage,
  FaKey,
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
  // Dashboard
  { label: "dashboard", to: "/dashboard", icon: FaThLarge },
  // Notifications
  {
    label: "notifications",
    to: "/dashboard/notifications",
    icon: FaBell,
    mobileOnly: true,
  },
  // Current Display
  {
    label: "current display",
    to: "/dashboard/current-display",
    icon: FaPlayCircle,
  },
  // Add to main display
  {
    label: "add to main display",
    to: "/dashboard/upload-content",
    icon: FaFolderPlus,
    children: [
      { label: "video", to: "/dashboard/upload-content/video", icon: FaVideo },
      { label: "image", to: "/dashboard/upload-content/image", icon: FaImage },
      {
        label: "news",
        to: "/dashboard/upload-content/text",
        icon: FaEnvelopeOpenText,
      },
    ],
  },
  // Standard Display
  {
    label: "standard display",
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
    ],
  },
  // Uploaded Contents
  {
    label: "Uploaded Displays",
    to: "/dashboard/contents",
    icon: FaScroll,
    children: [
      { label: "video", to: "/dashboard/contents/video", icon: FaVideo },
      { label: "image", to: "/dashboard/contents/image", icon: FaImage },
      {
        label: "news",
        to: "/dashboard/contents/text",
        icon: FaEnvelopeOpenText,
      },
    ],
  },
  // Permissions
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
  // Calendar
  {
    label: "calendar",
    to: "/dashboard/calendar",
    icon: FaCalendar,
    children: [
      {
        label: "calendar",
        to: "/dashboard/calendar/calendar",
        icon: FaCalendar,
      },
      { label: "settings", to: "/dashboard/calendar/settings", icon: FaCog },
    ],
  },
  // Profile
  {
    label: "profile",
    to: "/dashboard/account",
    icon: FaUser,
    children: [
      {
        label: "my profile",
        to: "/dashboard/account/my-profile",
        icon: FaUser,
        children: [
          {
            label: "change password",
            to: "/dashboard/account/my-profile/change-password",
            icon: FaKey,
          },
          {
            label: "update email",
            to: "/dashboard/account/my-profile/update-email",
            icon: FaEnvelope,
          },
        ],
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
