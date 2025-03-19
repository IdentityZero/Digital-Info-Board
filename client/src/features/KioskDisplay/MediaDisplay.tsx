import { useEffect, useState } from "react";

import { MediaDisplayType } from "../../types/FixedContentTypes";
import { listMediaDisplaysApi } from "../../api/fixedContentRquests";

type MediaDisplayProps = {
  initialIndex?: number;
  slideDuration?: number;
};

const MediaDisplay = ({
  initialIndex = 1,
  slideDuration = 5000,
}: MediaDisplayProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [mediaDisplays, setMediaDisplays] = useState<MediaDisplayType[]>([]);
  const totalItems = mediaDisplays.length;

  const extendedMedia = [
    mediaDisplays[totalItems - 1],
    ...mediaDisplays,
    mediaDisplays[0],
  ];

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex === 0) {
      setCurrentIndex(totalItems);
    } else if (currentIndex >= totalItems + 1) {
      setCurrentIndex(1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, slideDuration);

    return () => clearInterval(interval);
  }, [isTransitioning, currentIndex]);

  useEffect(() => {
    const fetchMediaDisplays = async () => {
      try {
        const res_data = await listMediaDisplaysApi();
        setMediaDisplays(res_data);
      } catch (error) {}
    };
    fetchMediaDisplays();
  }, []);

  return (
    <div className="w-full h-full overflow-hidden">
      {mediaDisplays.length === 0 ? (
        <div className="w-full h-full pt-4 text-center text-xl font-semibold">
          No displays to show
        </div>
      ) : (
        <div
          className={`flex transition-transform h-full w-full ${
            isTransitioning ? "duration-500" : "duration-0"
          }`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedMedia.map((medium, index) => (
            <div className="w-full h-full shrink-0" key={index}>
              <img
                src={medium.file}
                className="h-full w-full object-contain mx-auto"
                alt="Image"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default MediaDisplay;
