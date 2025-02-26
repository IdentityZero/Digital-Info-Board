import { useEffect, useState } from "react";
import LoadingMessage from "../../components/LoadingMessage";
import NewsTicker from "../../components/NewsTicker";
import useAnnouncementSlider from "../../features/announcements/hooks/useAnnouncementSlider";
import KMAnnouncementSlider from "../../features/kioskMode (KM)/KMAnnouncementSlider";
import KMFixedContentDisplay from "../../features/kioskMode (KM)/KMFixedContentDisplay";
import KMNoAnnouncementCard from "../../features/kioskMode (KM)/KMNoAnnouncementCard";
import KMWeatherForecast from "../../features/kioskMode (KM)/KMWeatherForecast";
import { extractReactQuillText } from "../../utils/formatters";
import { logoLg } from "../../assets";

const LiveAnnouncementKioskSize = () => {
  const {
    announcements,
    extendedAnnouncements,
    extendedDurations,
    isLoading,
    error,
  } = useAnnouncementSlider();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = logoLg;
    img.onload = () => setBackgroundImage(logoLg);
  }, [logoLg]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingMessage message="Loading..." fontSize="5xl" spinnerSize={72} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        Unexpected error occured...
      </div>
    );
  }

  const headlines = announcements.map((announcement) =>
    extractReactQuillText(announcement.title as string)
  );

  return (
    <div className="w-full h-screen flex flex-col">
      <section className="h-[70%]">
        <div
          className="fixed top-[-80px] inset-0 h-[calc(100vh-80px)] bg-contain bg-center bg-no-repeat opacity-5 blur-sm -z-10"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
        {announcements.length === 0 ? (
          <KMNoAnnouncementCard />
        ) : (
          <KMAnnouncementSlider
            announcements={extendedAnnouncements}
            durations={extendedDurations}
          />
        )}
      </section>
      <section className="h-[30%] bg-[#C6C6C6] p-4 mt-4">
        <div className="h-full flex flex-col">
          <div className="flex flex-row w-full h-[80%] ">
            <div className="w-[60%]">
              <KMFixedContentDisplay />
            </div>
            <div className="w-[40%]">
              <KMWeatherForecast />
            </div>
          </div>
          <div className="h-[20%] flex items-center overflow-hidden w-full pl-2">
            <p className="text-lg font-bold text-white bg-gray-500 p-2 shadow-md">
              Headlines:
            </p>
            <div className="flex-1 overflow-hidden shadow-md">
              <NewsTicker headlines={headlines} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default LiveAnnouncementKioskSize;
