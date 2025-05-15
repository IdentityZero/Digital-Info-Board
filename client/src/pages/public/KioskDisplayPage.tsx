import { useEffect, useState } from "react";

import DisplayQuillEditor from "../../components/DisplayQuillEditor";
import LoadingMessage from "../../components/LoadingMessage";

import { useRealtimeUpdate } from "../../context/RealtimeUpdate";

import VideoPlayer from "../../features/KioskDisplay/VideoPlayer";
import ImagePlayer from "../../features/KioskDisplay/ImagePlayer";
import NoAnnouncementCard from "../../features/KioskDisplay/NoAnnouncementCard";

import Footer from "../../features/KioskDisplay/Footer";
import MainAside from "../../features/KioskDisplay/MainAside";

import { SettingsType } from "../../types/SettingTypes";
import Modal from "../../components/ui/Modal";

const DELTA_FALLBACK_VALUE = JSON.stringify({ ops: [] });

const KioskDisplayPage = () => {
  /**
   * Notice that we used prop drilling although we are using context.
   * Since this page is expected to be utilized under low performance devices, we try to make rendering as few as possible.
   */

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPortrait, setIsPortrait] = useState(true);

  const {
    announcement: {
      mediaAnnouncements,
      mediaDurations,
      isLoading: IsAnnouncementFetching,
      error: hasAnnouncementFetchingError,
      textAnnouncementsAsText,
      setIdOnLock: setAnnouncementIdOnLock,
      preview,
      urgentAnnouncement,
    },
    events: { events, isLoading: isEventsFetching },
    mediaDisplays: { mediaDisplays, isLoading: isMediaDisplaysFetching },
    orgMembers: { orgMembers, isLoading: isOrgMembersFetching },
    settings: { settings },
    sensorData: { sensorData },
    isReady,
  } = useRealtimeUpdate();

  const handleNext = () => {
    if (currentIndex >= mediaAnnouncements.length - 1) {
      setCurrentIndex(0);
      setAnnouncementIdOnLock(mediaAnnouncements[0].id);
      return;
    }

    setCurrentIndex((prevIndex) => prevIndex + 1);
    setAnnouncementIdOnLock(mediaAnnouncements[currentIndex + 1].id);
  };

  useEffect(() => {
    if (mediaAnnouncements.length === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, mediaDurations[currentIndex] || 3000);

    return () => clearInterval(interval);
  }, [currentIndex, mediaAnnouncements]);

  if (!settings || !isReady) {
    return <LoadingMessage message="Fetching contents..." />;
  }

  const { show_upcoming_events, show_weather_forecast, show_media_displays } =
    settings as SettingsType;

  return (
    <div className="w-full h-screen flex flex-col bg-[#1B0B7C] text-white overflow-hidden">
      <header className="h-[5vh] flex items-center justify-center w-full">
        {mediaAnnouncements.length > 0 ? (
          <DisplayQuillEditor
            value={JSON.parse(
              preview
                ? (preview.title as string)
                : mediaAnnouncements[currentIndex]
                ? (mediaAnnouncements[currentIndex].title as string)
                : (DELTA_FALLBACK_VALUE as string)
            )}
            withBackground={false}
          />
        ) : IsAnnouncementFetching ? (
          hasAnnouncementFetchingError ? (
            <LoadingMessage message="Error fetching, retrying..." />
          ) : (
            <LoadingMessage message="Fetching Announcements" />
          )
        ) : (
          <NoAnnouncementCard />
        )}
      </header>

      <main
        className={`${
          show_upcoming_events || show_weather_forecast || show_media_displays
            ? "h-[63vh]"
            : "h-[87vh]"
        } flex-1 flex ${isPortrait ? "flex-row gap-2" : "flex-col"}`}
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
              {preview ? (
                <>
                  {preview.image_announcement &&
                    preview.image_announcement.length > 0 && (
                      <ImagePlayer
                        key={preview.id}
                        images={preview.image_announcement}
                        setIsPortrait={setIsPortrait}
                      />
                    )}
                  {preview.video_announcement &&
                    preview.video_announcement.length > 0 && (
                      <VideoPlayer
                        key={preview.id}
                        videos={preview.video_announcement}
                        setIsPortrait={setIsPortrait}
                      />
                    )}
                </>
              ) : mediaAnnouncements[currentIndex] ? (
                <>
                  {mediaAnnouncements[currentIndex].image_announcement &&
                    mediaAnnouncements[currentIndex].image_announcement.length >
                      0 && (
                      <ImagePlayer
                        key={currentIndex}
                        images={
                          mediaAnnouncements[currentIndex].image_announcement
                        }
                        setIsPortrait={setIsPortrait}
                      />
                    )}
                  {mediaAnnouncements[currentIndex].video_announcement &&
                    mediaAnnouncements[currentIndex].video_announcement.length >
                      0 && (
                      <VideoPlayer
                        key={currentIndex}
                        videos={
                          mediaAnnouncements[currentIndex].video_announcement
                        }
                        setIsPortrait={setIsPortrait}
                      />
                    )}
                </>
              ) : (
                <LoadingMessage message="Restarting..." />
              )}
            </>
          ) : IsAnnouncementFetching ? (
            hasAnnouncementFetchingError ? (
              <LoadingMessage message="Error fetching, retrying..." />
            ) : (
              <LoadingMessage message="Fetching Announcements" />
            )
          ) : (
            <NoAnnouncementCard />
          )}
        </div>

        <div
          className={`${
            isPortrait
              ? `${
                  settings.show_calendar || settings.show_organization
                    ? "w-[33%]"
                    : "max-w-[33%]"
                }`
              : `w-full max-h-[40%] p-2 ${
                  (settings.show_calendar ||
                    settings.show_media_displays ||
                    settings.show_organization) &&
                  "h-full"
                }`
          } `}
        >
          <MainAside
            isPortrait={isPortrait}
            settings={settings as SettingsType}
            mediaDisplays={mediaDisplays}
            isMediaDisplaysFetching={isMediaDisplaysFetching}
            orgMembers={orgMembers}
            isOrgMembersFetching={isOrgMembersFetching}
          />
        </div>
      </main>

      <footer
        className={`${
          show_upcoming_events || show_weather_forecast || show_media_displays
            ? "h-[30vh]"
            : "h-28"
        }`}
      >
        <Footer
          headlines={textAnnouncementsAsText}
          settings={settings as SettingsType}
          events={events}
          isEventsFetching={isEventsFetching}
          mediaDisplays={mediaDisplays}
          isMediaDisplaysFetching={isMediaDisplaysFetching}
          sensorData={sensorData}
        />
      </footer>
      {!!urgentAnnouncement && (
        <Modal isOpen={!!urgentAnnouncement} onClose={() => {}} size="full">
          <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
            <DisplayQuillEditor value={urgentAnnouncement.title} />
            <DisplayQuillEditor value={urgentAnnouncement.description} />
          </div>
        </Modal>
      )}
    </div>
  );
};
export default KioskDisplayPage;
