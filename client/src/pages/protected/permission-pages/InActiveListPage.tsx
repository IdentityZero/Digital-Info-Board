import { useEffect, useState } from "react";

import Pagination from "../../../components/Pagination";
import ErrorMessage from "../../../components/ErrorMessage";
import LoadingMessage from "../../../components/LoadingMessage";

import usePagination from "../../../hooks/usePagination";

import {
  AnnouncementRetrieveType,
  AnnouncementTypeWithUrgency,
  NonUrgentAnnouncementType,
  UrgentAnnouncementType,
  UrgentAnnouncementTypeWithType,
} from "../../../types/AnnouncementTypes";
import { ListInactiveAnnouncement } from "../../../features/announcements";
import { listStatBasedAnnouncementApiV2 } from "../../../api/announcementRequest";
import { getListTypeInitState, ListType } from "../../../types/ListType";
import ListInactiveUrgentAnnouncement from "../../../features/announcements/ListAnnouncement/ListInactiveUrgentAnnouncement";

const InActiveListPage = () => {
  const { page, setPage, pageSize, setPageSize } = usePagination(
    "pageSize_inAtiveList",
    10
  );

  const [inActiveAnnouncements, setInActiveAnnouncements] = useState<
    ListType<AnnouncementTypeWithUrgency>
  >(getListTypeInitState());

  const [urgentAnnouncements, setUrgentAnnouncements] = useState<
    UrgentAnnouncementTypeWithType[]
  >([]);
  const [nonUrgentAnnouncements, setNonUrgentAnnouncements] = useState<
    NonUrgentAnnouncementType[]
  >([]);

  const totalPages = Math.max(
    1,
    Math.ceil(inActiveAnnouncements.count / pageSize)
  );

  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchAnnouncements = async (ppage: number, ppageSize: number) => {
    try {
      setIsFetching(true);
      const res_data = await listStatBasedAnnouncementApiV2(
        "inactive",
        ppage,
        ppageSize
      );
      const urgent: UrgentAnnouncementTypeWithType[] = [];
      const nonUrgent: NonUrgentAnnouncementType[] = [];

      res_data.results.forEach((res) => {
        if (res.type === "urgent") urgent.push(res);
        else if (res.type === "non-urgent") nonUrgent.push(res);
      });

      setUrgentAnnouncements(urgent);
      setNonUrgentAnnouncements(nonUrgent);
      setInActiveAnnouncements(res_data);
    } catch (error) {
      setHasError(true);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(page, pageSize);
  }, [page, pageSize]);

  const handleSetInActiveAnnouncements = (
    updatedList: AnnouncementRetrieveType[]
  ) => {
    setNonUrgentAnnouncements(() => {
      return updatedList.map((announcement) => ({
        ...announcement,
        type: "non-urgent",
      }));
    });
  };

  const handleSetActiveUrgentAnnouncements = (
    updatedList: UrgentAnnouncementType[]
  ) => {
    setUrgentAnnouncements(() => {
      return updatedList.map((announcement) => ({
        ...announcement,
        type: "urgent",
      }));
    });
  };

  if (isFetching)
    return (
      <div className="mt-4">
        <LoadingMessage message="Fetching Inactive Contents" />
      </div>
    );

  if (hasError) {
    return (
      <div className="p-4">
        <ErrorMessage message="Something went wrong while fetching contents for approval. Please try again." />
      </div>
    );
  }

  return (
    <>
      <div className="px-4">
        <Pagination
          pageSize={pageSize}
          page={page}
          totalPages={totalPages}
          setPageSize={setPageSize}
          setPage={setPage}
        />
      </div>
      <ListInactiveUrgentAnnouncement
        announcements={urgentAnnouncements}
        setAnnouncements={handleSetActiveUrgentAnnouncements}
      />
      <ListInactiveAnnouncement
        inactiveAnnouncements={nonUrgentAnnouncements}
        setInactiveAnnouncements={handleSetInActiveAnnouncements}
      />
    </>
  );
};
export default InActiveListPage;
