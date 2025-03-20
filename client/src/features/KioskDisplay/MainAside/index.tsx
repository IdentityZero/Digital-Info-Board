import { memo } from "react";
import OrgMembers from "./OrgMembers";
import MediaDisplay from "../MediaDisplay";
import { SettingsType } from "../../../types/SettingTypes";
import { convertDurationToSeconds } from "../../../utils/utils";

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
            isPortrait ? "w-full flex-1" : "h-full flex-1"
          } bg-white flex items-center justify-center text-gray-800 text-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden`}
        >
          <iframe
            className="w-full h-full border-0"
            src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FManila&showPrint=0&showTz=0&showTitle=0&showNav=0&showTabs=0&src=ZjE5NmZkNjhmNTM4NTk2NTQzOWI1ODk2MmM0OGY3N2RjMzRmNjY5ZTZiOTI4ZmMwMjZlNTMzYjg4YmMyNjhjYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%237CB342&mode=MONTH"
          ></iframe>
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
