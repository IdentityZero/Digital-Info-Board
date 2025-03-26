import { useEffect, useState } from "react";
import LoadingMessage from "../../components/LoadingMessage";
import AnnouncementCarousel from "./AnnouncementCarousel";
import useAnnouncementSlider from "./hooks/useAnnouncementSlider";
import { LIVE_ANNOUNCEMENT_URL } from "../../constants/urls";
import useSiteSettings from "../../hooks/useSiteSettings";
import {
  calculateElapsedTime,
  findIndexByWeight,
  sortItemsByPosition,
} from "../../utils/utils";

type MessageType = {
  type: "new_position";
  message: { id: number; new_position: number }[];
};

const LiveAnnouncement = () => {
  const { announcements, setAnnouncements, durations, isLoading, error } =
    useAnnouncementSlider();
  const [carouselStartIndex, setCarouselStartIndex] = useState<
    number | undefined
  >(undefined);
  const [carouselStartInterval, setCarouselStartInterval] = useState<
    number | undefined
  >(undefined);
  const { settings } = useSiteSettings();

  // Connect to a web socket
  useEffect(() => {
    const ws = new WebSocket(LIVE_ANNOUNCEMENT_URL);

    ws.onmessage = (e: MessageEvent<any>) => {
      let data: MessageType = JSON.parse(e.data);

      // Update the sequence of the announcements
      if (data.type === "new_position") {
        setAnnouncements((prev) =>
          sortItemsByPosition(structuredClone(prev), data.message)
        );
        setCarouselStartIndex(1);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // Sync the index based on the announcement start time
  useEffect(() => {
    // Add isLoading to make sure there is announcement already
    if (!settings || isLoading) return;

    const elapsedTime = calculateElapsedTime(settings.announcement_start);
    const totalDuration = durations.reduce(
      (acc, duration) => acc + duration,
      0
    );
    const remainingTime = elapsedTime % totalDuration;
    const startIndex = findIndexByWeight(durations, remainingTime);

    const startIndexRemainingTime = (): number => {
      let sum = 0;

      durations.some((duration, index) => {
        sum += duration;
        return index === startIndex;
      });

      return sum - remainingTime;
    };

    setCarouselStartInterval(startIndexRemainingTime());
    setCarouselStartIndex(startIndex + 1);
  }, [settings, isLoading]);

  if (isLoading) {
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
    <>
      {announcements.length > 0 &&
        carouselStartIndex &&
        carouselStartInterval && (
          <AnnouncementCarousel
            announcements={announcements}
            durations={durations}
            index={carouselStartIndex}
            startInterval={carouselStartInterval}
          />
        )}
    </>
  );
};
export default LiveAnnouncement;
