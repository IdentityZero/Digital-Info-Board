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

  useEffect(() => {
    const currentVideo = videos[currentIndex];

    if (!currentVideo) return;
    const video = document.createElement("video");
    video.src = currentVideo.video as string;
    const handleLoadedMetadata = () => {
      console.log("Video dimensions:", video.videoWidth, video.videoHeight);
      setIsPortrait(video.videoHeight > video.videoWidth);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.load(); // Start loading metadata (dimensions)

    return () =>
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, [currentIndex]);

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
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {videos.map((video, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            {/* Blurred Background Video */}
            <video
              className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-110 brightness-75"
              src={video.video as string}
              muted
              autoPlay
              loop
              playsInline
            />

            {/* Foreground Video with controls */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <video
                controls
                ref={(el) => (videoRefs.current[index] = el)}
                className="w-auto h-full object-contain mx-auto"
                autoPlay={index === 0}
                loop
                playsInline
                // onPlay={(el) => {
                //   setIsPortrait(
                //     el.currentTarget.videoHeight > el.currentTarget.videoWidth
                //   );
                // }}
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
