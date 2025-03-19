import { useEffect, useState } from "react";

import { logoLg } from "../../../assets";
import { chunkArray } from "../../../utils/utils";

import { OrganizationMembersType } from "../../../types/FixedContentTypes";
import { listOrgmembersApi } from "../../../api/fixedContentRquests";
import LoadingMessage from "../../../components/LoadingMessage";

const OrgMembers = ({ slideDuration = 5000 }: { slideDuration?: number }) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [orgMembers, setOrgMembers] = useState<OrganizationMembersType[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const chunkedItems = chunkArray(orgMembers, 4);
  const totalItems = chunkedItems.length;
  const extendedMembers = [
    chunkedItems[totalItems - 1],
    ...chunkedItems,
    chunkedItems[0],
  ];

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex === 0) {
      setCurrentIndex(totalItems);
    } else if (currentIndex === totalItems + 1) {
      setCurrentIndex(1);
    }
  };

  useEffect(() => {
    const fetchOrgMembers = async () => {
      try {
        setIsLoading(true);
        const res_data = await listOrgmembersApi();
        setOrgMembers(res_data);
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrgMembers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, slideDuration);

    return () => clearInterval(interval);
  }, [isTransitioning, currentIndex]);

  return (
    <div className="w-full h-full relative border rounded-lg shadow-lg overflow-hidden py-2">
      <img
        src={logoLg}
        alt="logo"
        className="absolute opacity-5 h-full w-full object-contain object-center"
      />
      <div className="z-[1] h-full w-full flex flex-col mt-2">
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
      </div>
    </div>
  );
};
export default OrgMembers;

function CardContainer({ members }: { members: OrganizationMembersType[] }) {
  return (
    <div className="h-full w-full flex flex-col justify-evenly gap-2 overflow-hidden">
      {members.map((member) => (
        <OrgCard member={member} />
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
        <span className="text-sm font-semibold">
          {member.name || "Engr. Juan Dela Cruz"}
        </span>
        <span className="text-xs">{member.position || "No position"}</span>
      </div>
    </div>
  );
}
