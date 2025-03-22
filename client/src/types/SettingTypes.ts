export type CalendarGridTypes = "dayGridMonth" | "timeGridWeek" | "timeGridDay";
export type SettingsType = {
  announcement_start: string;

  // Displays Settings

  show_organization: boolean;
  show_upcoming_events: boolean;
  show_media_displays: boolean;
  show_weather_forecast: boolean;
  show_calendar: boolean;
  organization_slide_duration: string; // "hh:mm:ss" format of durations
  media_displays_slide_duration: string;
  upcoming_events_slide_duration: string;

  // Calendar Settings

  web_calendar_grid_type: CalendarGridTypes;
  web_max_events: number;
  web_show_events: boolean;
  web_show_weekends: boolean;
  web_show_grid_controls: boolean;
  web_show_nav_controls: boolean;
  kiosk_calendar_grid_type: CalendarGridTypes;
  kiosk_max_events: number;
  kiosk_show_events: boolean;
  kiosk_show_weekends: boolean;
  kiosk_show_grid_controls: boolean;
  kiosk_show_nav_controls: boolean;
};

export const DEFAULT_SETTINGS_IF_ERROR: SettingsType = {
  announcement_start: "2025-02-14T20:09:08+08:00",

  // Displays Settings

  show_organization: true,
  show_upcoming_events: true,
  show_media_displays: true,
  show_weather_forecast: true,
  show_calendar: true,
  organization_slide_duration: "00:00:10",
  media_displays_slide_duration: "00:00:10",
  upcoming_events_slide_duration: "00:00:10",

  // Calendar Settings

  web_calendar_grid_type: "dayGridMonth",
  web_max_events: 0,
  web_show_events: false,
  web_show_weekends: false,
  web_show_grid_controls: false,
  web_show_nav_controls: false,
  kiosk_calendar_grid_type: "dayGridMonth",
  kiosk_max_events: 0,
  kiosk_show_events: false,
  kiosk_show_weekends: false,
  kiosk_show_grid_controls: false,
  kiosk_show_nav_controls: false,
};
