import { useEffect, useState } from "react";

import { DEFAULT_SETTINGS_IF_ERROR, SettingsType } from "../types/SettingTypes";
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
        setSettings(DEFAULT_SETTINGS_IF_ERROR);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return { settings, isLoading, setSettings };
};
export default useSiteSettings;
