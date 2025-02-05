import { useEffect, useState } from "react";
import WeatherForecast from "./WeatherForecast";
import { FixedContentType, getActiveFixedContents } from "./constant";
import LoadingMessage from "../../components/LoadingMessage";

const FixedContentDisplay = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [expandedActiveContents, setExpandedActiveContents] = useState<
    FixedContentType[]
  >([]);
  const [totalContents, setTotalContents] = useState<undefined | number>(
    undefined
  );

  const [hasFetchingError, setHasFetchingError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const duration = 5000; // ms

  useEffect(() => {
    const fetchActiveContents = async () => {
      try {
        setIsLoading(true);
        const resData = await getActiveFixedContents();
        const expandedResData = [
          resData[resData.length - 1],
          ...resData,
          resData[0],
        ];

        setTotalContents(
          resData.length - resData.filter((data) => data.ownContainer).length
        );
        setExpandedActiveContents(expandedResData);
      } catch (error) {
        setHasFetchingError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActiveContents();
  }, []);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleTransitionEnd = () => {
    if (!totalContents) return;
    setIsTransitioning(false);
    if (currentIndex === 0) {
      setCurrentIndex(totalContents);
    } else if (currentIndex === totalContents + 1) {
      setCurrentIndex(1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, duration);

    return () => clearInterval(interval);
  }, [isTransitioning, currentIndex]);

  if (isLoading) {
    return <LoadingMessage message="Loading contents..." />;
  }

  if (hasFetchingError) {
    return <div>There was an error while fetching contents...</div>;
  }

  return (
    <div className="flex flex-row max-xl:flex-col-reverse gap-y-2">
      <div
        className={`${
          expandedActiveContents &&
          expandedActiveContents.some((obj) => obj.id === 4) // Check if forecasts exists
            ? "basis-2/3"
            : "basis-full"
        } drop-shadow-sm rounded-md overflow-hidden w-full my-auto`}
      >
        <div
          className={`flex transition-transform  ${
            isTransitioning ? "duration-500" : "duration-0"
          }`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {expandedActiveContents.map((content, index) => {
            if (content.ownContainer) return null;

            return (
              <div className="flex-shrink-0 w-full" key={index}>
                {<content.component />}
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 mb-4">
          {totalContents &&
            Array.from({ length: totalContents }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index + 1)}
                className={`w-3 h-3 rounded-full ${
                  index + 1 === currentIndex ||
                  (totalContents &&
                    currentIndex === 0 &&
                    index === totalContents - 1) ||
                  (totalContents &&
                    currentIndex === totalContents + 1 &&
                    index === 0)
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
        </div>
      </div>
      {expandedActiveContents &&
        expandedActiveContents.some((obj) => obj.id === 4) && (
          <div className="basis-1/3">
            <WeatherForecast />
          </div>
        )}
    </div>
  );
};
export default FixedContentDisplay;
