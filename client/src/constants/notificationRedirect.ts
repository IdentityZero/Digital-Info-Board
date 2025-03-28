export const NOTIFICATION_REDIRECT = {
  welcome_new_user: "/dashboard/upload-content/video",
  profile_update: "/dashboard/account/my-profile",

  approve_announcement: (id: number) => `/dashboard/permissions/inactive#${id}`,
  announcement_approved: "/dashboard/current-display",
  text_announcement_deactivated: (id: number) =>
    `/dashboard/contents/text/${id}`,
  image_announcement_deactivated: (id: number) =>
    `/dashboard/contents/image/${id}`,
  video_announcement_deactivated: (id: number) =>
    `/dashboard/contents/video/${id}`,
  announcement_sequence_update: "/dashboard/current-display",

  settings_update: "/dashboard/default-display",

  organization_member_added: (id: number) =>
    `/dashboard/default-display/organization#${id}`,
  organization_member_deleted: "/dashboard/default-display/organization",
  organization_sequence_update: "/dashboard/default-display/organization",

  upcoming_event_added: (id: number) =>
    `/dashboard/default-display/events#${id}`,
  upcoming_event_deleted: "/dashboard/default-display/events",

  media_display_added: (id: number) => `/dashboard/default-display/media#${id}`,
  media_display_deleted: "/dashboard/default-display/media",
  media_sequence_update: "/dashboard/default-display/media",

  calendar_event_added: (id: number) => `/dashboard/calendar#${id}`,
  calendar_event_updated: (id: number) => `/dashboard/calendar#${id}`,
  calendar_event_deleted: "/dashboard/calendar",
  calendar_settings_updated: "/dashboard/calendar/settings",
} as const;

export const getNotifRedirectPath = (
  action: keyof typeof NOTIFICATION_REDIRECT,
  target_id?: number
) => {
  const path = NOTIFICATION_REDIRECT[action];
  const pathType = typeof path;

  if (!path) {
    return "#";
  }

  if (pathType === "function" && !target_id) {
    return "#";
  }
  return typeof path === "function" ? path(target_id!) : path;
};
