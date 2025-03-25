export const BASE_API_URL = "localhost:8000";

export const LIVE_ANNOUNCEMENT_URL =
  "ws://" + BASE_API_URL + "/ws/live-announcement/";

export const LIVE_CONTENT_UPDATE_URL =
  "ws://" + BASE_API_URL + "/ws/live-content-updates/";

export const SITE_SETTINGS_URL = "http://" + BASE_API_URL + "/settings/";

export const FIELD_DEVICES_URL = "ws://" + BASE_API_URL + "/ws/field-devices/";

export const NOTIFICATIONS_URL = (id: string) => {
  return "ws://" + BASE_API_URL + "/ws/notifications/" + id + "/";
};
