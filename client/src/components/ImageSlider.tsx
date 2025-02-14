import { useEffect, useState } from "react";

interface ImageSliderProps {
  images: string[];
  durations: number[];
  showDuration?: boolean;
  showArrows?: boolean;
  reset?: boolean;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  durations,
  showDuration = true,
  showArrows = true,
  reset = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalImages = images.length;
  const extendedImages = [images[totalImages - 1], ...images, images[0]];
  const extendedDurations = [
    durations[totalImages - 1],
    ...durations,
    durations[0],
  ];

  useEffect(() => {
    if (reset) {
      setCurrentIndex(1);
    }
  }, [reset]);

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
      setCurrentIndex(totalImages);
    } else if (currentIndex === totalImages + 1) {
      setCurrentIndex(1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, extendedDurations[currentIndex]);

    return () => clearInterval(interval);
  }, [isTransitioning, currentIndex]);

  return (
    <div className="relative w-full h-full mx-auto overflow-hidden">
      {/* Image Slider */}
      <div
        className={`flex transition-transform h-full ${
          isTransitioning ? "duration-500" : "duration-0"
        }`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedImages.map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img
              src={image}
              alt={`Slide ${index}`}
              className="w-auto h-full object-contain mx-auto"
            />
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
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index + 1)}
            className={`w-3 h-3 rounded-full ${
              index + 1 === currentIndex ||
              (currentIndex === 0 && index === totalImages - 1) ||
              (currentIndex === totalImages + 1 && index === 0)
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

export default ImageSlider;
