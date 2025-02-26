import { useState, useEffect } from "react";
import LoadingMessage from "../../components/LoadingMessage";
import {
  FixedContentType,
  getActiveFixedContents,
} from "../fixedContent/constant";

const KMFixedContentDisplay = () => {
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

  const duration = 2000; // ms

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
    <div className="w-full h-full border-8 border-gray-200 shadow-md">
      <div className="drop-shadow-sm rounded-md overflow-hidden w-full h-full my-auto basis-full">
        <div
          className={`flex transition-transform h-full  ${
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
      </div>
    </div>
  );
};
export default KMFixedContentDisplay;
