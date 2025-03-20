import { useEffect, useState } from "react";
import { ImageAnnouncementType } from "../../types/AnnouncementTypes";
import { convertDurationToSeconds } from "../../utils/utils";

type ImagePlayerProps = {
  images: ImageAnnouncementType[];
  setIsPortrait: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImagePlayer = ({ images, setIsPortrait }: ImagePlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => {
      return currentIndex === images.length - 1 ? 0 : prev + 1;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, convertDurationToSeconds(images[currentIndex].duration as string) * 1000 || 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="w-full h-full mx-auto overflow-hidden">
      <div
        className="flex transition-transform h-full duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img
              src={image.image as string}
              alt=""
              className="w-full h-full object-contain"
              onLoad={(e) => {
                const target = e.currentTarget;
                setIsPortrait(target.naturalHeight > target.naturalWidth);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default ImagePlayer;
