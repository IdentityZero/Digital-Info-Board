import useSiteSettings from "../../../hooks/useSiteSettings";

const useSiteSettingsUpdatable = () => {
  const { settings, isLoading, setSettings } = useSiteSettings();

  return { settings, isLoading, setSettings };
};
export default useSiteSettingsUpdatable;
