import { useRef, useState } from "react";
import { Id } from "react-toastify";

import LoadingMessage from "../../../components/LoadingMessage";
import Modal from "../../../components/ui/Modal";

import { useAuth } from "../../../context/AuthProvider";
import useSiteSettings from "../../../hooks/useSiteSettings";
import useLoadingToast from "../../../hooks/useLoadingToast";

import { SettingsType } from "../../../types/SettingTypes";
import { updateSystemSettingsApi } from "../../../api/settingsRequest";

import OrgMembers from "../../../features/KioskDisplay/MainAside/OrgMembers";
import UpcomingEventsCard from "../../../features/KioskDisplay/Footer/UpcomingEventsCard";
import MediaDisplay from "../../../features/KioskDisplay/MediaDisplay";
import WeatherForecast from "../../../features/KioskDisplay/Footer/WeatherForecast";
import ActivationCard from "../../../features/fixedContent/Settings/ActivationCard";
import CalendarCard from "../../../features/KioskDisplay/MainAside/CalendarCard";

import SlideshowDuration from "./Settings/SlideshowDuration";

type FixedContentMapType = {
  name: string;
  key: keyof SettingsType;
  component: (args: any) => JSX.Element;
};

const fixedContentMapName: FixedContentMapType[] = [
  { name: "Organization", key: "show_organization", component: OrgMembers },
  {
    name: "Upcoming Events",
    key: "show_upcoming_events",
    component: UpcomingEventsCard,
  },
  {
    name: "Media Displays",
    key: "show_media_displays",
    component: MediaDisplay,
  },
  {
    name: "Weather Forecast",
    key: "show_weather_forecast",
    component: WeatherForecast,
  },
  { name: "Calendar", key: "show_calendar", component: CalendarCard },
];

const DefaultDisplaySettingsPage = () => {
  const { settings, isLoading, setSettings } = useSiteSettings();
  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);

  const [onPreview, setOnPreview] = useState<keyof SettingsType | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  if (!settings) {
    return isLoading ? (
      <LoadingMessage message="Fetching settings" />
    ) : (
      <div className="text-center font-semibold text-lg">
        Unexpected error loading settings
      </div>
    );
  }

  const handlePreview = (key: keyof SettingsType) => {
    setOnPreview(key);
  };

  const handleActivation = async (
    isActivated: boolean,
    componentKey: keyof SettingsType
  ) => {
    loading("Saving updates. Please wait...");
    try {
      setIsSaving(true);
      await updateSystemSettingsApi(userApi, componentKey, !isActivated);
      update({
        render: "Update succesful.",
        type: "success",
      });
      setSettings(
        (prevSetting) =>
          ({ ...prevSetting, [componentKey]: !isActivated } as SettingsType)
      );
    } catch (error) {
      update({
        render: "Update unsuccessful. Please try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      {fixedContentMapName.map((content, index) => (
        <>
          <ActivationCard
            key={index}
            title={content.name}
            componentKey={content.key}
            handlePreview={handlePreview}
            handleActivation={handleActivation}
            isActivated={settings[content.key] as boolean}
            isLoading={isSaving}
          />
          <Modal
            isOpen={content.key === onPreview}
            onClose={() => setOnPreview(null)}
            size="lg"
          >
            <content.component />
          </Modal>
        </>
      ))}
      <section>
        {settings && (
          <SlideshowDuration
            settings={settings}
            setSettings={
              setSettings as React.Dispatch<React.SetStateAction<SettingsType>>
            }
            isSaving={isSaving}
            setIsSaving={setIsSaving}
          />
        )}
      </section>
    </div>
  );
};
export default DefaultDisplaySettingsPage;
