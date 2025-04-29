import { useEffect, useRef, useState } from "react";

import { logoLg } from "../../../assets";
import { chunkArray } from "../../../utils/utils";

import { OrganizationMembersType } from "../../../types/FixedContentTypes";
import LoadingMessage from "../../../components/LoadingMessage";

type OrgMembersDisplayProps = {
  orgMembers: OrganizationMembersType[];
  isLoading: boolean;
  slideDuration?: number;
  showNavigation?: boolean;
  useChunking?: boolean; // Variable content size based on container size
};

const OrgMembers = ({
  orgMembers,
  isLoading,
  showNavigation = false,
  slideDuration = 5000,
  useChunking = false,
}: OrgMembersDisplayProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [chunkSize, setChunkSize] = useState(4);

  const [hoverShowNavigation, setHoverShowNavigation] = useState(false);

  const chunkedItems = chunkArray(orgMembers, chunkSize);
  const totalItems = chunkedItems.length;
  const extendedMembers = [
    chunkedItems[totalItems - 1],
    ...chunkedItems,
    chunkedItems[0],
  ];

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
    if (currentIndex <= 0) {
      setCurrentIndex(totalItems);
    } else if (currentIndex >= totalItems + 1) {
      setCurrentIndex(1);
    }
  };

  useEffect(() => {
    // To rerun in case of error because it freezes
    setIsTransitioning(false);
  }, [orgMembers]);

  useEffect(() => {
    if (!useChunking || !containerRef || !containerRef.current) return;
    const height = containerRef.current?.offsetHeight - 50;
    const cardMaxHeight = 80;
    const computedChunkSize = Math.floor(height / cardMaxHeight) || 4;

    setChunkSize(computedChunkSize);
  }, [containerRef, containerRef.current?.offsetHeight]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, slideDuration);

    return () => clearInterval(interval);
  }, [isTransitioning, currentIndex]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative border rounded-lg shadow-lg overflow-hidden py-2"
      onMouseEnter={() => setHoverShowNavigation(true)}
      onMouseLeave={() => setHoverShowNavigation(false)}
    >
      <img
        src={logoLg}
        alt="logo"
        className="absolute opacity-5 h-full w-full object-contain object-center"
      />
      <div className="z-[1] h-full w-full flex flex-col mt-2 relative">
        <p className="text-center font-bold text-xl text-black">
          CPE Department
        </p>
        {isLoading || !orgMembers ? (
          <LoadingMessage message="Loading..." />
        ) : orgMembers.length === 0 ? (
          <p className="text-black text-center font-semibold text-lg mt-2">
            No members listed.
          </p>
        ) : (
          <div
            className={`flex transition-transform h-full w-full ${
              isTransitioning ? "duration-500" : "duration-0"
            }`}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedMembers.map((members, index) => (
              <div className="w-full h-full shrink-0" key={index}>
                <CardContainer members={members} />
              </div>
            ))}
          </div>
        )}
        {hoverShowNavigation && showNavigation && (
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
    </div>
  );
};
export default OrgMembers;

function CardContainer({ members }: { members: OrganizationMembersType[] }) {
  return (
    <div className="h-full w-full flex flex-col justify-evenly gap-2 overflow-hidden">
      {members.map((member) => (
        <OrgCard member={member} key={member.id} />
      ))}
    </div>
  );
}

function OrgCard({ member }: { member: OrganizationMembersType }) {
  return (
    <div className="flex items-center space-x-2 px-4">
      <img
        className="w-16 h-16 rounded-full object-cover"
        src={member.image}
        alt={member.name || "thumbnail"}
      />
      <div className="flex flex-col items-center bg-[#2f6dc1] w-full rounded-full text-white py-1">
        <span className="text-sm font-semibold text-center">
          {member.name || "Engr. Juan Dela Cruz"}
        </span>
        <span className="text-xs">{member.position || "No position"}</span>
      </div>
    </div>
  );
}
