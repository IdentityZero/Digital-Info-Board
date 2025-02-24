import { useEffect, useState } from "react";
import { listAnnouncementApi } from "../../../api/announcementRequest";
import { ListActiveAnnouncement } from "../../../features/announcements";
import { AnnouncementListType } from "../../../types/AnnouncementTypes";
import LoadingMessage from "../../../components/LoadingMessage";

const ActiveListPage = () => {
  const [activeAnnouncements, setActiveAnnouncements] =
    useState<AnnouncementListType>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsFetching(true);
        const res_data = await listAnnouncementApi("active");
        setActiveAnnouncements(res_data);
      } catch (error) {
        setHasError(true);
      } finally {
        setIsFetching(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (isFetching)
    return (
      <div className="mt-4">
        <LoadingMessage message="Fetching Active Contents" />
      </div>
    );

  if (hasError) {
    return (
      <div className="mt-4 text-center">
        Unexpected Error occured. Please try again.
      </div>
    );
  }

  return (
    <>
      <ListActiveAnnouncement
        activeAnnouncements={activeAnnouncements}
        setActiveAnnouncements={setActiveAnnouncements}
      />
    </>
  );
};
export default ActiveListPage;
