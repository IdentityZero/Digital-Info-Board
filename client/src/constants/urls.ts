const BASE_API_URL_VALUE = import.meta.env.VITE_API_BASE_URL;

const protocol = BASE_API_URL_VALUE ? "ws://" : "wss://";
const httpProtocol = BASE_API_URL_VALUE ? "http://" : "";

export const BASE_API_URL = BASE_API_URL_VALUE || window.location.host + "/api";

export const LIVE_ANNOUNCEMENT_URL =
  protocol + BASE_API_URL + "/ws/live-announcement/";

export const LIVE_CONTENT_UPDATE_URL =
  protocol + BASE_API_URL + "/ws/live-content-updates/";

export const SITE_SETTINGS_URL = httpProtocol + BASE_API_URL + "/settings/";

export const FIELD_DEVICES_URL = protocol + BASE_API_URL + "/ws/field-devices/";

export const NOTIFICATIONS_URL = (id: string) => {
  return protocol + BASE_API_URL + "/ws/notifications/" + id + "/";
};
