import { useRef, useState } from "react";
import { Id } from "react-toastify";

import LoadingMessage from "../../../components/LoadingMessage";
import Modal from "../../../components/ui/Modal";

import { useAuth } from "../../../context/AuthProvider";
import useSiteSettings from "../../../hooks/useSiteSettings";
import useLoadingToast from "../../../hooks/useLoadingToast";

import { SettingsType } from "../../../types/SettingTypes";
import { updateSystemSettingsApi } from "../../../api/settingsRequest";

import ActivationCard from "../../../features/fixedContent/Settings/ActivationCard";

import SlideshowDuration from "./Settings/SlideshowDuration";

import DisplayMediaDisplays from "../../../features/fixedContent/MediaDisplays/DisplayMediaDisplays";
import CalendarDisplay from "../../../features/Calendar/v2/CalendarDisplay";
import WebDisplayWeatherForecast from "../../../features/fixedContent/WeatherForecast/WebDisplayWeatherForecast";
import DisplayOrgMembers from "../../../features/fixedContent/Organization/DisplayOrgMembers";
import WebDisplayEvents from "../../../features/fixedContent/Events/WebDisplayEvents";
import ErrorMessage from "../../../components/ErrorMessage";

type FixedContentMapType = {
  name: string;
  key: keyof SettingsType;
  component: (args: any) => JSX.Element;
};

const CalendarDisplayWrapper = () => {
  return (
    <div className="w-full h-[600px]">
      <CalendarDisplay
        showEvents={true}
        showGridControls={true}
        showNavigation={true}
        dayMaxEventRows={3}
        showWeekends={true}
      />
    </div>
  );
};

const OrgMemberDisplayWrapper = () => {
  return <DisplayOrgMembers showNavigation slideDuration={5000} />;
};

const fixedContentMapName: FixedContentMapType[] = [
  {
    name: "Organization",
    key: "show_organization",
    component: OrgMemberDisplayWrapper,
  },
  {
    name: "Upcoming Events",
    key: "show_upcoming_events",
    component: WebDisplayEvents,
  },
  {
    name: "Media Displays",
    key: "show_media_displays",
    component: DisplayMediaDisplays,
  },
  {
    name: "Weather Forecast",
    key: "show_weather_forecast",
    component: WebDisplayWeatherForecast,
  },
  { name: "Calendar", key: "show_calendar", component: CalendarDisplayWrapper },
];

const DefaultDisplaySettingsPage = () => {
  const { settings, isLoading, setSettings, hasError } = useSiteSettings();
  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);

  const [onPreview, setOnPreview] = useState<keyof SettingsType | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  // Leave this here
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
    const conf = confirm(
      `Are you sure you want to ${isActivated ? "REMOVE" : "ADD"} this ${
        isActivated ? "from" : "to"
      } the display?`
    );

    if (!conf) return;

    loading("Saving updates. Please wait...");
    try {
      setIsSaving(true);
      await updateSystemSettingsApi(userApi, { [componentKey]: !isActivated });
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

  if (isLoading) {
    return <LoadingMessage message="Fetching settings" />;
  }

  if (hasError) {
    return (
      <div className="p-4">
        <ErrorMessage message="Something went wrong while fetching settings. Attempting to fetch again." />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-2">
      {fixedContentMapName.map((content) => (
        <div key={content.name}>
          <ActivationCard
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
            size="xl"
          >
            <content.component />
          </Modal>
        </div>
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
