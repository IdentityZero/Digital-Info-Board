import useSiteSettings from "../../hooks/useSiteSettings";

const useSiteSettingsUpdatable = () => {
  /**
   * Created a new file in case of possible changes
   */
  const { fetchSettings, settings, isLoading, setSettings } = useSiteSettings();

  return { fetchSettings, settings, isLoading, setSettings };
};
export default useSiteSettingsUpdatable;
