import { useEffect, useState } from "react";
import { AnnouncementListType } from "../../types/AnnouncementTypes";
import KMAnnouncementDetail from "./KMAnnouncementDetail";

type KMAnnouncementSliderProps = {
  announcements: AnnouncementListType;
  durations: number[];
};

const KMAnnouncementSlider = ({
  announcements,
  durations,
}: KMAnnouncementSliderProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [idOnPlay, setIdOnplay] = useState(announcements[1].id);
  console.log(announcements);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
    setIdOnplay(announcements[currentIndex + 1].id);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex <= 0) {
      setCurrentIndex(announcements.length);
    } else if (currentIndex === announcements.length + 1) {
      setCurrentIndex(1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, durations[currentIndex] || 5000);

    return () => clearInterval(interval);
  }, [isTransitioning, currentIndex]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div className="relative !w-full mx-auto overflow-hidden h-full">
        <div
          className={`flex transition-transform h-full ${
            isTransitioning ? "duration-500" : "duration-0"
          }`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {announcements.map((announcement, index) => (
            <div className="w-full flex-shrink-0" key={index}>
              <KMAnnouncementDetail
                announcement={announcement}
                play={announcement.id === idOnPlay}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default KMAnnouncementSlider;
