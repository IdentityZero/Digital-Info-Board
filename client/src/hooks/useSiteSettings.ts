import axios from "axios";
import { useEffect, useState } from "react";
import { SITE_SETTINGS_URL } from "../constants/urls";

type SettingsType = {
  announcement_start: string;
};

const useSiteSettings = () => {
  const [settings, setSettings] = useState<undefined | SettingsType>(undefined);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(SITE_SETTINGS_URL);
        setSettings(res.data);
      } catch (error) {}
    };
    fetchSettings();
  }, []);

  return { settings };
};
export default useSiteSettings;
