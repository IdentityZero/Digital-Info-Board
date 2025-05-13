import { useEffect, useRef, useState } from "react";
import { Id } from "react-toastify";

import useLoadingToast from "../../../../hooks/useLoadingToast";
import { useAuth } from "../../../../context/AuthProvider";
import usePagination from "../../../../hooks/usePagination";

import {
  listTextAnnouncementApi,
  deleteTextAnnouncementApi,
} from "../../../../api/announcementRequest";
import { PaginatedAnnouncementListTypeV1 } from "../../../../types/AnnouncementTypes";
import { getListTypeInitState } from "../../../../types/ListType";

import AnnouncementTableList from "../../../../features/announcements/ListAnnouncement/AnnouncementTableList";
import LoadingOrErrorWrapper from "../../../../components/LoadingOrErrorWrapper";

const TextContentListPage = () => {
  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { page, setPage, pageSize, setPageSize } = usePagination(
    "pageSize_textList",
    10
  );

  const [announcements, setAnnouncements] =
    useState<PaginatedAnnouncementListTypeV1>(getListTypeInitState());
  const totalPages = Math.max(1, Math.ceil(announcements.count / pageSize));

  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnnouncements = async (ppage: number, ppageSize: number) => {
    try {
      setIsLoading(true);
      const data = await listTextAnnouncementApi(userApi, ppage, ppageSize);
      setAnnouncements(data);
    } catch (error) {
      setHasLoadingError(true);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAnnouncements(page, pageSize);
  }, [page, pageSize]);

  const handleDelete = async (announcement_id: string) => {
    const confirm_delete = confirm(
      `Are you sure you want to delete this Announcement?`
    );

    if (!confirm_delete) return;

    loading(`Deleting - ${announcement_id}. Please wait...`);
    try {
      await deleteTextAnnouncementApi(userApi, announcement_id);
      update({ render: "Delete successful", type: "success" });
      // Remove the data
      const updated = announcements.results.filter(
        (announcement) => announcement.id !== announcement_id
      );
      setAnnouncements((prev) => ({
        ...prev,
        results: updated,
        count: prev.count - 1,
      }));
    } catch (error) {
      update({
        render: "Delete unsuccessful. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <LoadingOrErrorWrapper isLoading={isLoading} hasError={hasLoadingError}>
      <div className="w-full mt-5">
        <AnnouncementTableList
          handleDelete={handleDelete}
          announcements={announcements}
          pageSize={pageSize}
          totalPages={totalPages}
          page={page}
          setPageSize={setPageSize}
          setPage={setPage}
        />
      </div>
    </LoadingOrErrorWrapper>
  );
};
export default TextContentListPage;
