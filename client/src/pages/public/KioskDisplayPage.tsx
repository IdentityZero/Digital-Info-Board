import { useEffect, useState } from "react";
import DisplayQuillEditor from "../../components/DisplayQuillEditor";
import LoadingMessage from "../../components/LoadingMessage";
import useAnnouncementData from "../../features/KioskDisplay/useAnnouncementData";
import VideoPlayer from "../../features/KioskDisplay/VideoPlayer";
import ImagePlayer from "../../features/KioskDisplay/ImagePlayer";
import Footer from "../../features/KioskDisplay/Footer";
import MainAside from "../../features/KioskDisplay/MainAside";

const KioskDisplayPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {
    mediaAnnouncements,
    mediaDurations,
    isLoading,
    textAnnouncementsAsText,
  } = useAnnouncementData();
  const [isPortrait, setIsPortrait] = useState(true);

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

  if (isLoading) {
    return <LoadingMessage message="Fetching contents..." />;
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#1B0B7C] text-white">
      <header className="min-h-20 h-[8vh] max-h-[8%] flex items-center justify-center w-full">
        <DisplayQuillEditor
          value={JSON.parse(mediaAnnouncements[currentIndex].title as string)}
          withBackground={false}
        />
      </header>

      <main
        className={`min-h-[700px] h-[60vh] max-h-[60%] flex p-2 gap-2 ${
          isPortrait ? "flex-row" : "flex-col"
        }`}
      >
        <div
          className={`${
            isPortrait ? "w-[65.28%] h-full" : "w-full h-[60%]"
          }  bg-gray-400 flex items-center justify-center text-white text-lg  border border-white/20 rounded-2xl shadow-xl overflow-hidden`}
        >
          {mediaAnnouncements[currentIndex].image_announcement &&
            mediaAnnouncements[currentIndex].image_announcement.length > 0 && (
              <ImagePlayer
                images={mediaAnnouncements[currentIndex].image_announcement}
                setIsPortrait={setIsPortrait}
              />
            )}
          {mediaAnnouncements[currentIndex].video_announcement &&
            mediaAnnouncements[currentIndex].video_announcement.length > 0 && (
              <VideoPlayer
                key={currentIndex}
                videos={mediaAnnouncements[currentIndex].video_announcement}
                setIsPortrait={setIsPortrait}
              />
            )}
        </div>

        <div
          className={`${
            isPortrait
              ? "basis-[34.72%] h-full flex-col gap-2"
              : "w-full h-[39%] flex-row gap-1 p-2"
          } flex `}
        >
          <MainAside isPortrait={isPortrait} />
        </div>
      </main>

      <footer className="h-[30%]">
        <Footer headlines={textAnnouncementsAsText} />
      </footer>
    </div>
  );
};
export default KioskDisplayPage;
