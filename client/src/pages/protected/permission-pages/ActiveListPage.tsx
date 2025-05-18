import { useEffect, useState } from "react";

import LoadingMessage from "../../../components/LoadingMessage";
import ErrorMessage from "../../../components/ErrorMessage";
import Pagination from "../../../components/Pagination";

import usePagination from "../../../hooks/usePagination";

import { getListTypeInitState, ListType } from "../../../types/ListType";
import { listStatBasedAnnouncementApiV2 } from "../../../api/announcementRequest";
import {
  AnnouncementTypeWithUrgency,
  NonUrgentAnnouncementType,
  UrgentAnnouncementType,
  UrgentAnnouncementTypeWithType,
  type AnnouncementRetrieveType,
} from "../../../types/AnnouncementTypes";

import { ListActiveAnnouncement } from "../../../features/announcements";
import ListActiveUrgentAnnouncement from "../../../features/announcements/ListAnnouncement/ListActiveUrgentAnnouncement";

const ActiveListPage = () => {
  const { page, setPage, pageSize, setPageSize } = usePagination(
    "pageSize_activeList",
    10
  );

  const [activeAnnouncements, setActiveAnnouncements] = useState<
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
    Math.ceil(activeAnnouncements.count / pageSize)
  );

  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchAnnouncements = async (ppage: number, ppageSize: number) => {
    try {
      setIsFetching(true);
      const res_data = await listStatBasedAnnouncementApiV2(
        "active",
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

      setActiveAnnouncements(res_data);
    } catch (error) {
      setHasError(true);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(page, pageSize);
  }, [page, pageSize]);

  const handleSetActiveAnnouncements = (
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
        <LoadingMessage message="Fetching Active Contents" />
      </div>
    );

  if (hasError) {
    return (
      <div className="p-4">
        <ErrorMessage message="Something went wrong while fetching approved contents. Please try again." />
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
      <ListActiveUrgentAnnouncement
        announcements={urgentAnnouncements}
        setAnnouncements={handleSetActiveUrgentAnnouncements}
      />
      <ListActiveAnnouncement
        activeAnnouncements={nonUrgentAnnouncements}
        setActiveAnnouncements={handleSetActiveAnnouncements}
      />
    </>
  );
};
export default ActiveListPage;
