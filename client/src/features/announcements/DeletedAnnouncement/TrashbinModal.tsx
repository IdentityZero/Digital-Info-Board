import { useEffect, useRef, useState } from "react";
import { Id, toast } from "react-toastify";

import Modal from "../../../components/ui/Modal";
import LoadingOrErrorWrapper from "../../../components/LoadingOrErrorWrapper";

import { useAuth } from "../../../context/AuthProvider";
import usePagination from "../../../hooks/usePagination";
import useLoadingToast from "../../../hooks/useLoadingToast";

import {
  AnnouncementTypes,
  PaginatedAnnouncementListTypeV1,
} from "../../../types/AnnouncementTypes";
import { getListTypeInitState } from "../../../types/ListType";

import {
  listPaginatedDeletedAnnouncementApi,
  permanentlyDeleteAnnouncementApi,
  restoreDeletedAnnouncementApi,
} from "../../../api/announcementRequest";

import AnnouncementTableList from "../ListAnnouncement/AnnouncementTableList";

type TrashbinModalProps = {
  onClose: () => void;
  type: AnnouncementTypes;
};

const TrashbinModal = ({ onClose, type }: TrashbinModalProps) => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();
  const paginationProps = usePagination("pageSize_deletedAnnouncementList", 10);

  const [announcements, setAnnouncements] =
    useState<PaginatedAnnouncementListTypeV1>(getListTypeInitState());

  const totalPages = Math.max(
    1,
    Math.ceil(announcements.count / paginationProps.pageSize)
  );

  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  const fetchAnnouncements = async (ppage: number, ppageSize: number) => {
    try {
      const data = await listPaginatedDeletedAnnouncementApi(
        userApi,
        type,
        ppage,
        ppageSize
      );
      setAnnouncements(data);
    } catch (error) {
      setHasLoadingError(true);
    } finally {
      setisLoading(false);
    }
  };

  const handleDelete = async (announcement_id: string) => {
    const conf_delete = confirm(
      "Are you sure you want to permanently delete this Announcement?"
    );

    if (!conf_delete) return;

    loading("Permanently deleting content. Please wait");

    try {
      await permanentlyDeleteAnnouncementApi(userApi, announcement_id);
      update({
        render: "Deleted succesfully.",
        type: "success",
      });
      setAnnouncements((prev) => ({
        ...prev,
        results: prev.results.filter((item) => item.id !== announcement_id),
      }));
    } catch (error) {
      update({
        render: "Delete failed. Please try again.",
        type: "error",
      });
    }
  };

  const handleRestore = async (announcement_id: string) => {
    const conf = confirm("Are you sure you want to restore this?");

    if (!conf) return;

    loading("Restoring content. Please wait");
    try {
      await restoreDeletedAnnouncementApi(userApi, announcement_id);
      update({
        render: "Restored succesfully.",
        type: "success",
      });
      setAnnouncements((prev) => ({
        ...prev,
        results: prev.results.filter((item) => item.id !== announcement_id),
      }));
      toast("Refresh page to reflect changes.");
    } catch (error) {
      update({
        render: "Restore failed. Please try again.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchAnnouncements(paginationProps.page, paginationProps.pageSize);
  }, [paginationProps.page, paginationProps.pageSize]);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Deleted ${type} contents`}
      size="full"
    >
      <LoadingOrErrorWrapper
        isLoading={isLoading}
        hasError={hasLoadingError}
        hasErrorMessage="Failed to load your contents. Please try again."
      >
        <AnnouncementTableList
          allowView={false}
          announcements={announcements}
          handleDelete={handleDelete}
          handleRestore={handleRestore}
          {...paginationProps}
          totalPages={totalPages}
        />
      </LoadingOrErrorWrapper>
    </Modal>
  );
};
export default TrashbinModal;
