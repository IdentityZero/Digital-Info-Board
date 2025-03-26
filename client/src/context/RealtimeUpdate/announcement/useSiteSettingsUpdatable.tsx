import useSiteSettings from "../../../hooks/useSiteSettings";

const useSiteSettingsUpdatable = () => {
  /**
   * Created a new file in case of possible changes
   */
  const { settings, isLoading, setSettings } = useSiteSettings();

  return { settings, isLoading, setSettings };
};
export default useSiteSettingsUpdatable;
