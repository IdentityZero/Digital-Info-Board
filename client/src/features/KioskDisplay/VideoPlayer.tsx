import { useEffect, useRef, useState } from "react";
import { VideoAnnouncementType } from "../../types/AnnouncementTypes";
import { convertDurationToSeconds } from "../../utils/utils";

type VideoPlayerProps = {
  videos: VideoAnnouncementType[];
  setIsPortrait: React.Dispatch<React.SetStateAction<boolean>>;
};

const VideoPlayer = ({ videos, setIsPortrait }: VideoPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const resetAllVideos = () => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  const handleNext = () => {
    resetAllVideos();
    if (currentIndex === videos.length - 1) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex((prevIndex) => prevIndex + 1);
    videoRefs.current[currentIndex + 1]?.play();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, convertDurationToSeconds(videos[currentIndex].duration) * 1000 || 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="w-full h-full mx-auto overflow-hidden">
      <div
        className="flex transition-transform h-full duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {videos.map((video, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <video
              controls
              ref={(el) => (videoRefs.current[index] = el)}
              className="w-auto h-full object-contain mx-auto"
              autoPlay={index === 0}
              onPlay={(el) => {
                setIsPortrait(
                  el.currentTarget.videoHeight > el.currentTarget.videoWidth
                );
              }}
            >
              <source src={video.video as string} />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};
export default VideoPlayer;
