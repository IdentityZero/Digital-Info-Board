import { useEffect, useState } from "react";

import { SettingsType } from "../types/SettingTypes";
import { listSystemSettingsApi } from "../api/settingsRequest";

const useSiteSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<undefined | SettingsType>(undefined);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const res_data = await listSystemSettingsApi();
        setSettings(res_data);
      } catch (error) {
        setSettings({
          announcement_start: "2025-02-14T20:09:08+08:00",
          show_organization: true,
          show_upcoming_events: true,
          show_media_displays: true,
          show_weather_forecast: true,
          show_calendar: true,
          organization_slide_duration: "00:00:10",
          media_displays_slide_duration: "00:00:10",
          upcoming_events_slide_duration: "00:00:10",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return { settings, isLoading, setSettings };
};
export default useSiteSettings;
