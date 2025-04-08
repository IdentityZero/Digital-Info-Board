import { useEffect, useState } from "react";

import Pagination from "../../../components/Pagination";
import ErrorMessage from "../../../components/ErrorMessage";
import LoadingMessage from "../../../components/LoadingMessage";

import usePagination from "../../../hooks/usePagination";

import {
  AnnouncementRetrieveType,
  type PaginatedAnnouncementListTypeV1,
} from "../../../types/AnnouncementTypes";
import { ListInactiveAnnouncement } from "../../../features/announcements";
import { listStatBasedAnnouncementApi } from "../../../api/announcementRequest";
import { getListTypeInitState } from "../../../types/ListType";

const InActiveListPage = () => {
  const { page, setPage, pageSize, setPageSize } = usePagination(
    "pageSize_inAtiveList",
    10
  );

  const [inActiveAnnouncements, setInActiveAnnouncements] =
    useState<PaginatedAnnouncementListTypeV1>(getListTypeInitState());
  const totalPages = Math.max(
    1,
    Math.ceil(inActiveAnnouncements.count / pageSize)
  );

  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchAnnouncements = async (ppage: number, ppageSize: number) => {
    try {
      setIsFetching(true);
      const res_data = await listStatBasedAnnouncementApi(
        "inactive",
        ppage,
        ppageSize
      );
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
    setInActiveAnnouncements((prev) => ({ ...prev, results: updatedList }));
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
      <ListInactiveAnnouncement
        inactiveAnnouncements={inActiveAnnouncements.results}
        setInactiveAnnouncements={handleSetInActiveAnnouncements}
      />
    </>
  );
};
export default InActiveListPage;
