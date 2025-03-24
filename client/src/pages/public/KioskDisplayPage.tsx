import { useEffect, useState } from "react";
import { MdOutlineCampaign } from "react-icons/md";

import DisplayQuillEditor from "../../components/DisplayQuillEditor";
import LoadingMessage from "../../components/LoadingMessage";

import useAnnouncementData from "../../features/KioskDisplay/useAnnouncementData";
import useSiteSettings from "../../hooks/useSiteSettings";

import VideoPlayer from "../../features/KioskDisplay/VideoPlayer";
import ImagePlayer from "../../features/KioskDisplay/ImagePlayer";

import Footer from "../../features/KioskDisplay/Footer";
import MainAside from "../../features/KioskDisplay/MainAside";
import { SettingsType } from "../../types/SettingTypes";

const KioskDisplayPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {
    mediaAnnouncements,
    mediaDurations,
    isLoading: IsAnnouncementFetching,
    error: hasAnnouncementFetchingError,
    textAnnouncementsAsText,
  } = useAnnouncementData();
  const [isPortrait, setIsPortrait] = useState(true);

  const { settings } = useSiteSettings();

  const handleNext = () => {
    if (currentIndex === mediaAnnouncements.length - 1) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  useEffect(() => {
    if (mediaAnnouncements.length === 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, mediaDurations[currentIndex] || 5000);

    return () => clearInterval(interval);
  }, [currentIndex, mediaAnnouncements]);

  if (!settings) {
    return <LoadingMessage message="Fetching contents..." />;
  }

  const { show_upcoming_events, show_weather_forecast, show_media_displays } =
    settings as SettingsType;

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#1B0B7C] text-white">
      <header className="min-h-20 h-[5vh] max-h-[5%] flex items-center justify-center w-full">
        {mediaAnnouncements.length > 0 ? (
          <DisplayQuillEditor
            value={JSON.parse(mediaAnnouncements[currentIndex].title as string)}
            withBackground={false}
          />
        ) : IsAnnouncementFetching ? (
          hasAnnouncementFetchingError ? (
            <LoadingMessage message="Error fetching, retrying..." />
          ) : (
            <LoadingMessage message="Fetching Announcements" />
          )
        ) : (
          <NoAnnouncement />
        )}
      </header>

      <main
        className={`min-h-[700px] ${
          show_upcoming_events || show_weather_forecast || show_media_displays
            ? "h-[64vh]"
            : "h-[87vh]"
        } flex ${isPortrait ? "flex-row" : "flex-col"}`}
      >
        <div
          className={`${
            isPortrait
              ? "min-w-[65.28%] flex-1 h-full"
              : "w-full flex-1 min-h-[60%] h-full"
          }  bg-gray-400 flex items-center justify-center text-white text-lg  border border-white/20 rounded-2xl shadow-xl overflow-hidden`}
        >
          {mediaAnnouncements.length > 0 ? (
            <>
              {mediaAnnouncements[currentIndex].image_announcement &&
                mediaAnnouncements[currentIndex].image_announcement.length >
                  0 && (
                  <ImagePlayer
                    images={mediaAnnouncements[currentIndex].image_announcement}
                    setIsPortrait={setIsPortrait}
                  />
                )}
              {mediaAnnouncements[currentIndex].video_announcement &&
                mediaAnnouncements[currentIndex].video_announcement.length >
                  0 && (
                  <VideoPlayer
                    key={currentIndex}
                    videos={mediaAnnouncements[currentIndex].video_announcement}
                    setIsPortrait={setIsPortrait}
                  />
                )}
            </>
          ) : IsAnnouncementFetching ? (
            hasAnnouncementFetchingError ? (
              <LoadingMessage message="Error fetching, retrying..." />
            ) : (
              <LoadingMessage message="Fetching Announcements" />
            )
          ) : (
            <NoAnnouncement />
          )}
        </div>

        <div
          className={`${
            isPortrait
              ? "max-w-[33%] px-2"
              : `w-full max-h-[40%] p-2 ${
                  (settings?.show_calendar ||
                    settings?.show_media_displays ||
                    settings?.show_organization) &&
                  "h-full"
                }`
          } `}
        >
          <MainAside
            isPortrait={isPortrait}
            settings={settings as SettingsType}
          />
        </div>
      </main>

      <footer className="h-[30%]">
        <Footer
          headlines={textAnnouncementsAsText}
          settings={settings as SettingsType}
        />
      </footer>
    </div>
  );
};
export default KioskDisplayPage;

function NoAnnouncement() {
  return (
    <div className="flex gap-2 items-center justify-center ">
      <MdOutlineCampaign className="w-12 h-12" />
      <p className="text-xl font-semibold">There are no announcements</p>
    </div>
  );
}
