// Change this to routed pages instead

import { useEffect, useState } from "react";

import {
  ListActiveAnnouncement,
  ListInactiveAnnouncement,
} from "../../features/announcements";
import { listAnnouncementApi } from "../../api/announcementRequest";
import { type AnnouncementListType } from "../../types/AnnouncementTypes";

const PermissionsPage = () => {
  const [page, setPage] = useState<1 | 2>(1);
  const [activeAnnouncements, setActiveAnnouncements] =
    useState<AnnouncementListType>([]);
  const [inactiveAnnouncements, setInactiveAnnouncements] =
    useState<AnnouncementListType>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res_data = await listAnnouncementApi("all");
        setActiveAnnouncements(res_data.filter((data) => data.is_active));
        setInactiveAnnouncements(
          res_data.filter((data) => data.is_active === false)
        );
      } catch (error) {}
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-[60px] flex flex-row mt-4">
        <button
          className={`basis-1/2 font-bold text-xl ${
            page === 1 ? "bg-cyanBlue" : "bg-white"
          }`}
          onClick={() => setPage(1)}
        >
          Current Approved Contents
        </button>
        <button
          className={`basis-1/2 font-bold text-xl ${
            page === 2 ? "bg-cyanBlue" : "bg-white"
          }`}
          onClick={() => setPage(2)}
        >
          For Approval
        </button>
      </div>
      {page === 1 && (
        <ListActiveAnnouncement
          activeAnnouncements={activeAnnouncements}
          setActiveAnnouncements={setActiveAnnouncements}
          setInactiveAnnouncements={setInactiveAnnouncements}
        />
      )}
      {page === 2 && (
        <ListInactiveAnnouncement
          inactiveAnnouncements={inactiveAnnouncements}
          setActiveAnnouncements={setActiveAnnouncements}
          setInactiveAnnouncements={setInactiveAnnouncements}
        />
      )}
    </div>
  );
};

export default PermissionsPage;
