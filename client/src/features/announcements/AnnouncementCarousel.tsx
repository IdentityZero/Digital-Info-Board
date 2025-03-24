import { useEffect, useState } from "react";

import { AnnouncementListType } from "../../types/AnnouncementTypes";
import DetailAnnouncement from "./DetailAnnouncement";

/**
 * AnnouncementCarousel Component
 *
 * A horizontally scrolling carousel that displays announcements sequentially
 * with auto-transition and manual navigation.
 *
 * @param {AnnouncementListType} announcements - List of announcements
 * @param {number[]} durations - Array of durations for each announcement
 * @param {number} index -  The starting index of the announcement.
 * @param {number} [startInterval] - Duration in milliseconds for the starting index
 */
type AnnouncementCarouselProps = {
  announcements: AnnouncementListType;
  durations: number[];
  index: number;
  startInterval?: number;
};

const AnnouncementCarousel = ({
  announcements,
  durations,
  index,
  startInterval,
}: AnnouncementCarouselProps) => {
  // problem with updating announcements
  const [isReady, setIsReady] = useState(false);

  // State for handling transition effects
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(index);
  const [useStartInterval, setUseStartInterval] = useState(true);

  /**
   * Extended announcements list to create a smooth looping transition.
   * The first and last elements are duplicated at the start and end.
   */
  const extendedAnnouncements = [
    announcements[announcements.length - 1],
    ...announcements,
    announcements[0],
  ];

  // Extended durations to match the extended announcements.
  const extendedDurations = [
    durations[announcements.length - 1],
    ...durations,
    durations[0],
  ];

  // Handles navigation to the previous announcement.
  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  // Handles navigation to the next announcement.
  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  // Handles transition end to reset index for seamless looping.
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex <= 0) {
      setCurrentIndex(announcements.length);
    } else if (currentIndex >= announcements.length + 1) {
      setCurrentIndex(1);
    }
  };

  // Auto-transition effect that cycles through announcements based on durations.
  useEffect(() => {
    const interval = setInterval(
      () => {
        handleNext();
      },
      useStartInterval ? startInterval : extendedDurations[currentIndex] || 5000
    );

    if (useStartInterval) {
      setUseStartInterval(false);
    }

    return () => clearInterval(interval);
  }, [isTransitioning, currentIndex]);

  useEffect(() => {
    // During first load, it runs this and sets index to 1, the reason for the timer
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    if (!isReady) return;
    setCurrentIndex(1);

    return () => clearTimeout(timer);
  }, [announcements]);

  return (
    <div className="!w-full !max-w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="relative !w-full mx-auto overflow-hidden">
        <div
          className={`flex transition-transform ${
            isTransitioning ? "duration-500" : "duration-0"
          }`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedAnnouncements?.map((announcement, index) => (
            <div className="w-full flex-shrink-0" key={index}>
              <DetailAnnouncement
                data={announcement}
                index={index}
                indexOnPlay={currentIndex}
              />
            </div>
          ))}
        </div>

        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-gray-600 focus:outline-none"
        >
          &#8249;
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-gray-600 focus:outline-none"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default AnnouncementCarousel;
