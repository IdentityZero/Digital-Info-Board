import { useEffect, useState, useRef } from "react";

interface VideoSliderProps {
  videos: string[];
  durations: number[];
  showDuration?: boolean;
  showArrows?: boolean;
  stop?: boolean;
  crossOrigin?: React.VideoHTMLAttributes<HTMLVideoElement>["crossOrigin"];
  showControls?: boolean;
}

const VideoSlider: React.FC<VideoSliderProps> = ({
  videos,
  durations,
  showDuration = true,
  showArrows = true,
  stop = false,
  crossOrigin,
  showControls = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const totalVideos = videos.length;
  const extendedVideos = [videos[totalVideos - 1], ...videos, videos[0]];
  const extendedDurations = [
    durations[totalVideos - 1],
    ...durations,
    durations[0],
  ];

  useEffect(() => {
    setCurrentIndex(1);
    if (stop) {
      resetAllVideos();
    } else {
      playCurrentVideo();
    }
  }, [stop]);

  const resetAllVideos = () => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  const playCurrentVideo = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentIndex === 0 || currentIndex === extendedVideos.length - 1)
      return;
    if (currentVideo) {
      currentVideo.play().catch((err) => {
        console.error("Failed to autoplay video:", err);
      });
    }
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex === 0) {
      setCurrentIndex(totalVideos);
    } else if (currentIndex === totalVideos + 1) {
      setCurrentIndex(1);
    }
  };

  // Play the current video when the index changes
  useEffect(() => {
    resetAllVideos();
    if (!stop) {
      playCurrentVideo();
    }
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, extendedDurations[currentIndex]);

    return () => clearInterval(interval);
  }, [isTransitioning, currentIndex]);

  return (
    <div className="relative w-full h-full mx-auto overflow-hidden">
      {/* Video Slider */}
      <div
        className={`flex transition-transform h-full ${
          isTransitioning ? "duration-500" : "duration-0"
        }`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedVideos.map((video, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <video
              controls={showControls}
              ref={(el) => (videoRefs.current[index] = el)}
              className="w-auto h-full object-contain mx-auto"
              crossOrigin={crossOrigin || undefined}
            >
              <source src={video} />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {showArrows && (
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-gray-600 focus:outline-none"
        >
          &#8249;
        </button>
      )}

      {showArrows && (
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-gray-600 focus:outline-none"
        >
          &#8250;
        </button>
      )}

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 mb-4">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index + 1);
            }}
            className={`w-3 h-3 rounded-full ${
              index + 1 === currentIndex ||
              (currentIndex === 0 && index === totalVideos - 1) ||
              (currentIndex === totalVideos + 1 && index === 0)
                ? "bg-blue-500"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {showDuration && (
        <div className="text-center">
          Duration:{" "}
          {isNaN(durations[currentIndex - 1] / 1000)
            ? durations[0] / 1000
            : durations[currentIndex - 1] / 1000}{" "}
          seconds
        </div>
      )}
    </div>
  );
};

export default VideoSlider;
