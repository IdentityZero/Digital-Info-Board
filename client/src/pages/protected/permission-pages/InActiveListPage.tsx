import { useEffect, useState } from "react";
import { AnnouncementListType } from "../../../types/AnnouncementTypes";
import { ListInactiveAnnouncement } from "../../../features/announcements";
import { listAnnouncementApi } from "../../../api/announcementRequest";
import LoadingMessage from "../../../components/LoadingMessage";

const InActiveListPage = () => {
  const [inActiveAnnouncements, setInActiveAnnouncements] =
    useState<AnnouncementListType>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsFetching(true);
        const res_data = await listAnnouncementApi("inactive");
        setInActiveAnnouncements(res_data);
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
        <LoadingMessage message="Fetching Inactive Contents" />
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
      <ListInactiveAnnouncement
        inactiveAnnouncements={inActiveAnnouncements}
        setInactiveAnnouncements={setInActiveAnnouncements}
      />
    </>
  );
};
export default InActiveListPage;
