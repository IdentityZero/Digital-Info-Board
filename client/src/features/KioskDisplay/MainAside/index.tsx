import { memo } from "react";

import { convertDurationToSeconds } from "../../../utils/utils";

import OrgMembers from "./OrgMembers";
import MediaDisplay from "../MediaDisplay";
import { SettingsType } from "../../../types/SettingTypes";
import CalendarDisplay from "../../Calendar/v2/CalendarDisplay";

type MainAsideProps = {
  isPortrait: boolean;
  settings: SettingsType;
};

const MainAside = memo(({ isPortrait, settings }: MainAsideProps) => {
  const {
    show_organization,
    show_calendar,
    show_media_displays,
    organization_slide_duration,
  } = settings;

  const hasActiveComponents =
    show_organization || show_calendar || show_media_displays;

  if (!hasActiveComponents) return null;

  return (
    <div
      className={`${
        isPortrait ? "flex-col gap-2" : "flex-row gap-1 justify-center"
      } flex w-full h-full`}
    >
      {/* Org Members */}
      {show_organization && (
        <div
          className={`${
            isPortrait ? "w-full flex-1" : "h-full flex-1"
          } bg-white  backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden `}
        >
          <OrgMembers
            useChunking
            slideDuration={
              convertDurationToSeconds(organization_slide_duration) * 1000
            }
          />
        </div>
      )}

      {/* Calendar */}
      {show_calendar && (
        <div
          className={`${
            isPortrait ? "w-full flex-1 " : "h-full flex-1"
          } bg-white flex items-center justify-center text-gray-800 text-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden`}
        >
          <CalendarDisplay
            initialGridView={settings.kiosk_calendar_grid_type}
            showEvents={settings.kiosk_show_events}
            showGridControls={settings.kiosk_show_grid_controls}
            showNavigation={settings.kiosk_show_nav_controls}
            dayMaxEventRows={settings.kiosk_max_events}
            showWeekends={settings.kiosk_show_weekends}
          />
        </div>
      )}

      {/* Facts */}
      {show_media_displays && (
        <div
          className={`${
            isPortrait ? "w-0 h-0" : "h-full flex-1"
          } bg-white flex items-center justify-center text-gray-800 text-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden`}
        >
          <MediaDisplay
            initialIndex={2}
            slideDuration={
              convertDurationToSeconds(settings.media_displays_slide_duration) *
              1000
            }
          />
        </div>
      )}
    </div>
  );
});

export default MainAside;
