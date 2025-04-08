import { useEffect, useRef, useState } from "react";

import LoadingMessage from "../../components/LoadingMessage";
import { useRealtimeUpdate } from "../../context/RealtimeUpdate";
import { mmsuBg } from "../../assets";

type MediaDisplayProps = {
  initialIndex?: number;
  slideDuration?: number;
  showNavigation?: boolean;
};

const MediaDisplay = ({
  initialIndex = 1,
  slideDuration = 5000,
  showNavigation = false,
}: MediaDisplayProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const {
    mediaDisplays: { mediaDisplays, isLoading },
  } = useRealtimeUpdate();
  const totalItems = mediaDisplays.length;

  const extendedMedia = [
    mediaDisplays[totalItems - 1],
    ...mediaDisplays,
    mediaDisplays[0],
  ];

  const resetAllVideos = () => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.currentTime = 0;
      }
    });
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const handleNext = () => {
    resetAllVideos();
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
    // To rerun in case of error because it freezes
    setIsTransitioning(false);
  }, [mediaDisplays]);

  return (
    <div
      className="w-full h-full overflow-hidden relative"
      style={{
        backgroundImage: `url(${mmsuBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        backgroundBlendMode: "overlay",
      }}
    >
      {isLoading ? (
        <LoadingMessage message="Loading..." />
      ) : mediaDisplays.length === 0 ? (
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
              {medium.type === "image" ? (
                <img
                  src={medium.file}
                  className="h-full w-full object-contain mx-auto"
                  alt="Image"
                />
              ) : (
                <video
                  className="h-full w-full object-contain mx-auto"
                  controls
                  autoPlay
                  muted
                  ref={(el) => (videoRefs.current[index] = el)}
                >
                  <source src={medium.file} />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </div>
      )}

      {showNavigation && (
        <>
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
        </>
      )}
    </div>
  );
};
export default MediaDisplay;
