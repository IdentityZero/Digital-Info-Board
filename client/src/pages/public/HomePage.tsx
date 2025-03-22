import useAnnouncementSlider from "../../features/announcements/hooks/useAnnouncementSlider";
import LoadingMessage from "../../components/LoadingMessage";
import { mmsuBg } from "../../assets";

import useSiteSettings from "../../hooks/useSiteSettings";

import { LiveAnnouncement } from "../../features/announcements";
import OrgMembers from "../../features/KioskDisplay/MainAside/OrgMembers";
import MediaDisplay from "../../features/KioskDisplay/MediaDisplay";
import WebDisplayEvents from "../../features/fixedContent/Events/WebDisplayEvents";
import WebDisplayWeatherForecast from "../../features/fixedContent/WeatherForecast/WebDisplayWeatherForecast";
import { convertDurationToSeconds } from "../../utils/utils";
import CalendarDisplay from "../../features/Calendar/v2/CalendarDisplay";

const HomePage = () => {
  // TODO: POSSIBILITY OF EMPTY ANNOUNCEMENT (The announcement has no body or type)
  const { announcements, isLoading, error } = useAnnouncementSlider();

  const { settings, isLoading: isSettingsLoading } = useSiteSettings();

  if (isLoading || isSettingsLoading) {
    return (
      <div className="mt-4">
        <LoadingMessage message="Loading..." />
      </div>
    );
  }

  if (error) {
    return <div className="mt-4 text-center">Unexpected error occured...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {announcements.length === 0 ? (
        <div className="mt-4 text-center">No announcements right now...</div>
      ) : (
        <LiveAnnouncement />
      )}
      <section className="w-full flex flex-col gap-10 p-2 justify-center items-center mb-4">
        <div className="w-full flex flex-col gap-2 lg:flex-row">
          {settings?.show_media_displays && (
            <div
              className="lg:flex-1 h-[400px] rounded-lg shadow-sm py-2 border mx-auto"
              style={{
                backgroundImage: `url(${mmsuBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                backgroundBlendMode: "overlay",
              }}
            >
              <MediaDisplay
                showNavigation
                slideDuration={
                  convertDurationToSeconds(
                    settings.media_displays_slide_duration
                  ) * 1000
                }
              />
            </div>
          )}
          {settings?.show_organization && (
            <div className="min-w-[400px] max-w-[500px] rounded-lg shadow-xl overflow-hidden border mx-auto">
              <OrgMembers
                showNavigation
                slideDuration={
                  convertDurationToSeconds(
                    settings.organization_slide_duration
                  ) * 1000
                }
              />
            </div>
          )}
        </div>

        <div className="w-full h-[600px]">
          {settings?.show_calendar && (
            <CalendarDisplay
              initialGridView={settings.web_calendar_grid_type}
              showEvents={settings.web_show_events}
              showGridControls={settings.web_show_grid_controls}
              showNavigation={settings.web_show_nav_controls}
              dayMaxEventRows={settings.web_max_events}
              showWeekends={settings.web_show_weekends}
            />
          )}
        </div>
        <div className="w-full flex flex-col gap-x-20 gap-y-2 lg:flex-row items-center justify-center">
          {settings?.show_weather_forecast && (
            <div className="w-full flex-1 min-h-[350px] max-w-[600px] rounded-lg shadow-sm py-2 border mx-auto">
              <WebDisplayWeatherForecast />
            </div>
          )}
          {settings?.show_upcoming_events && (
            <div className="w-full flex-1 min-h-[350px] max-w-[600px] rounded-lg shadow-sm py-2 border mx-auto">
              <WebDisplayEvents />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
export default HomePage;
