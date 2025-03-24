import { useEffect, useState } from "react";

import { DEFAULT_SETTINGS_IF_ERROR, SettingsType } from "../types/SettingTypes";
import { listSystemSettingsApi } from "../api/settingsRequest";

const useSiteSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<undefined | SettingsType>(undefined);

  const fetchSettings = () => {
    let delay = 1000;

    const retryFetch = async () => {
      try {
        setIsLoading(true);
        const res_data = await listSystemSettingsApi();
        setSettings(res_data);
      } catch (error) {
        delay = Math.min(delay * 2, 30000);
        setSettings(DEFAULT_SETTINGS_IF_ERROR);
        setTimeout(retryFetch, delay);
      } finally {
        setIsLoading(false);
      }
    };
    retryFetch();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, isLoading, setSettings };
};
export default useSiteSettings;
