import { useEffect, useState } from "react";
import { ImageAnnouncementType } from "../../types/AnnouncementTypes";
import { convertDurationToSeconds } from "../../utils/utils";

type ImagePlayerProps = {
  images: ImageAnnouncementType[];
  setIsPortrait: React.Dispatch<React.SetStateAction<boolean>>;
};

const ImagePlayer = ({
  images: initialImages,
  setIsPortrait,
}: ImagePlayerProps) => {
  const [images, _setImages] = useState(initialImages);
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
    <div className="w-full h-full overflow-hidden">
      <div
        className="flex transition-transform duration-500 h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => {
          const currentImage = images[currentIndex];

          if (index === currentIndex && currentImage) {
            const img = new Image();
            img.src = currentImage.image as string;

            img.onload = () => {
              setIsPortrait(img.naturalHeight > img.naturalWidth);
            };
          }

          return (
            <div key={index} className="relative w-full h-full flex-shrink-0">
              {/* Blurred Background */}
              <div
                className="absolute inset-0 bg-center bg-cover scale-110 filter blur-xl"
                style={{ backgroundImage: `url(${image.image})` }}
              ></div>

              {/* Dark Overlay to improve readability */}
              <div className="absolute inset-0 bg-black/30 z-0"></div>

              {/* Centered Foreground Image */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <img
                  src={image.image as string}
                  alt=""
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ImagePlayer;
