import { useEffect, useState } from "react";

import LoadingMessage from "../../../components/LoadingMessage";
import ErrorMessage from "../../../components/ErrorMessage";
import Pagination from "../../../components/Pagination";

import usePagination from "../../../hooks/usePagination";

import { getListTypeInitState } from "../../../types/ListType";
import { listStatBasedAnnouncementApi } from "../../../api/announcementRequest";
import {
  type AnnouncementRetrieveType,
  type PaginatedAnnouncementListTypeV1,
} from "../../../types/AnnouncementTypes";

import { ListActiveAnnouncement } from "../../../features/announcements";

const ActiveListPage = () => {
  const { page, setPage, pageSize, setPageSize } = usePagination(
    "pageSize_activeList",
    10
  );
  const [activeAnnouncements, setActiveAnnouncements] =
    useState<PaginatedAnnouncementListTypeV1>(getListTypeInitState());
  const totalPages = Math.max(
    1,
    Math.ceil(activeAnnouncements.count / pageSize)
  );

  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchAnnouncements = async (ppage: number, ppageSize: number) => {
    try {
      setIsFetching(true);
      const res_data = await listStatBasedAnnouncementApi(
        "active",
        ppage,
        ppageSize
      );
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
    setActiveAnnouncements((prev) => ({ ...prev, results: updatedList }));
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
      <ListActiveAnnouncement
        activeAnnouncements={activeAnnouncements.results}
        setActiveAnnouncements={handleSetActiveAnnouncements}
      />
    </>
  );
};
export default ActiveListPage;
