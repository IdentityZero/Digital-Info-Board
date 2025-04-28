import { useEffect, useRef, useState } from "react";
import { VideoAnnouncementType } from "../../types/AnnouncementTypes";
import { convertDurationToSeconds } from "../../utils/utils";

type VideoPlayerProps = {
  videos: VideoAnnouncementType[];
  setIsPortrait: React.Dispatch<React.SetStateAction<boolean>>;
};

const VideoPlayer = ({
  videos: initialVideos,
  setIsPortrait,
}: VideoPlayerProps) => {
  const [videos, _setVideos] = useState(initialVideos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [backgroundImage, setBackgroundImage] = useState("");

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
      videoRefs.current[0]?.play();
      return;
    }

    setCurrentIndex((prevIndex) => prevIndex + 1);
    videoRefs.current[currentIndex + 1]?.play();
  };

  const captureBackground = () => {
    setTimeout(() => {
      const currentVideo = videos[currentIndex];

      if (!currentVideo) return;
      const video = document.getElementById(
        `${currentIndex}`
      ) as HTMLVideoElement;

      if (!video) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      setBackgroundImage(dataUrl);
    }, 1000); // 1000 ms = 1 second
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, convertDurationToSeconds(videos[currentIndex].duration) * 1000 || 5000);

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex]);

  return (
    <div className="w-full h-full overflow-hidden">
      <div
        className="flex transition-transform duration-500 h-full"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {videos.map((video, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            <div
              className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-110 brightness-75"
              style={{
                backgroundImage: backgroundImage
                  ? `url(${backgroundImage})`
                  : undefined,
              }}
            />
            <div className="relative z-10 w-full h-full flex items-center justify-center ">
              <video
                id={`${index}`}
                crossOrigin="anonymous"
                controls
                ref={(el) => (videoRefs.current[index] = el)}
                className="w-auto h-full object-contain mx-auto"
                autoPlay={index === 0}
                loop
                playsInline
                onPlay={(el) => {
                  setIsPortrait(
                    el.currentTarget.videoHeight > el.currentTarget.videoWidth
                  );
                  captureBackground();
                }}
              >
                <source src={video.video as string} />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default VideoPlayer;
