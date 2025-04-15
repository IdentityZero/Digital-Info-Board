import { useEffect, useState } from "react";

import { DEFAULT_SETTINGS_IF_ERROR, SettingsType } from "../types/SettingTypes";
import { listSystemSettingsApi } from "../api/settingsRequest";

const useSiteSettings = () => {
  const [settings, setSettings] = useState<undefined | SettingsType>(undefined);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchSettings = () => {
    let delay = 1000;

    const retryFetch = async () => {
      try {
        setHasError(false);
        setIsLoading(true);
        const res_data = await listSystemSettingsApi();
        setSettings(res_data);
      } catch (error) {
        setHasError(true);
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

  return { fetchSettings, settings, setSettings, isLoading, hasError };
};
export default useSiteSettings;
