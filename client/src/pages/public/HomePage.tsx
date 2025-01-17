import { useEffect, useState } from "react";

import { addTotalDuration, convertDurationToSeconds } from "../../utils/utils";
import { AnnouncementListType } from "../../types/AnnouncementTypes";
import { listAnnouncementApi } from "../../api/announcementRequest";
import { DetailAnnouncement } from "../../features/announcements";

const HomePage = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementListType>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const extendedAnnouncements = [
    announcements[announcements?.length - 1],
    ...announcements,
    announcements[0],
  ];

  const durations = announcements.map((announcement) => {
    if (announcement.text_announcement) {
      return (
        convertDurationToSeconds(
          announcement.text_announcement.duration as string
        ) * 1000
      );
    } else if (announcement.image_announcement) {
      return (
        convertDurationToSeconds(
          addTotalDuration(announcement.image_announcement)
        ) * 1000
      );
    } else {
      return 5000;
    }
  });

  const extendedDurations = [
    durations[announcements.length - 1],
    ...durations,
    durations[0],
  ];

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const handleNext = () => {
    console.log("hello");

    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex === 0) {
      setCurrentIndex(announcements?.length);
    } else if (currentIndex === announcements?.length + 1) {
      setCurrentIndex(1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, extendedDurations[currentIndex]);

    return () => clearInterval(interval);
  }, [isTransitioning, currentIndex]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res_data = await listAnnouncementApi();
        setAnnouncements(res_data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <div>Unexpected error occured. Please try again later.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (announcements?.length === 0) {
    return <div>No announcements right now...</div>;
  }

  return (
    <div className="relative w-full mx-auto overflow-hidden">
      <div
        className={`flex transition-transform  ${
          isTransitioning ? "duration-500" : "duration-0"
        }`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedAnnouncements?.map((announcement, index) => (
          <div className="w-full flex-shrink-0" key={index}>
            <DetailAnnouncement data={announcement} />
          </div>
        ))}
      </div>
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-gray-600 focus:outline-none"
      >
        &#8249;
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-gray-600 focus:outline-none"
      >
        &#8250;
      </button>
    </div>
  );
};
export default HomePage;
