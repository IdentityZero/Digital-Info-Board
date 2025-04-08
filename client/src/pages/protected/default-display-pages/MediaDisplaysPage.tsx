import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Id } from "react-toastify";

import LoadingMessage from "../../../components/LoadingMessage";
import Pagination from "../../../components/Pagination";
import ErrorMessage from "../../../components/ErrorMessage";

import usePagination from "../../../hooks/usePagination";
import { useAuth } from "../../../context/AuthProvider";
import useLoadingToast from "../../../hooks/useLoadingToast";

import { getChangedObj } from "../../../utils/utils";

import { getListTypeInitState, ListType } from "../../../types/ListType";
import { MediaDisplayType } from "../../../types/FixedContentTypes";
import {
  deleteMediaDisplayApi,
  listPaginatedMediaDisplayApi,
  updateMediaDisplaysPriorityApi,
} from "../../../api/fixedContentRquests";

import ListMediaDisplays from "../../../features/fixedContent/MediaDisplays/ListMediaDisplays";
import CreateMediaDisplay from "../../../features/fixedContent/MediaDisplays/CreateMediaDisplay";

const MediaDisplaysPage = () => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();
  const { page, setPage, pageSize, setPageSize } = usePagination(
    "pageSize_mediaDisplayList",
    10
  );

  const [mediaDisplayList, setMediaDisplayList] = useState<
    ListType<MediaDisplayType>
  >(getListTypeInitState());
  const totalPages = Math.max(1, Math.ceil(mediaDisplayList.count / pageSize));

  const [isFetching, setIsFetching] = useState(true);
  const [hasFetchingError, setHasFetchingError] = useState(true);

  const fetchMediaDisplayList = async (ppage: number, ppageSize: number) => {
    try {
      setHasFetchingError(false);
      setIsFetching(true);
      const res_data = await listPaginatedMediaDisplayApi(ppage, ppageSize);
      setMediaDisplayList(res_data);
    } catch (error) {
      setHasFetchingError(true);
    } finally {
      setIsFetching(false);
    }
  };

  const addToList = (newMedia: MediaDisplayType) => {
    setMediaDisplayList((prev) => {
      const updatedList = [...prev.results, newMedia];
      if (updatedList.length > pageSize) {
        updatedList.pop();
      }
      return { ...prev, count: prev.count + 1, results: updatedList };
    });
  };

  const handleDelete = async (id: number) => {
    const del_conf = window.confirm("Are you sure you want to delete?");

    if (!del_conf) return;

    loading("Deleting. Please wait...");

    try {
      await deleteMediaDisplayApi(userApi, id);
      update({
        render: "Delete successful.",
        type: "success",
      });
      setMediaDisplayList((prev) => {
        const updated = prev.results.filter((medium) => medium.id !== id);
        return { ...prev, results: updated, count: prev.count - 1 };
      });
    } catch (error) {
      update({
        render: "Delete failed. Please try again.",
        type: "error",
      });
    }
  };

  const handleUpdatePriority = async (newPrioArr: MediaDisplayType[]) => {
    const updatedPrioList = getChangedObj(
      mediaDisplayList.results,
      newPrioArr
    ).map((medium) => ({ id: medium.id, priority: medium.priority }));

    loading("Updating priority sequence. Please wait...");

    try {
      await updateMediaDisplaysPriorityApi(userApi, updatedPrioList);

      update({
        render: "Update successful",
        type: "success",
      });
      setMediaDisplayList((prev) => ({ ...prev, results: newPrioArr }));
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        update({
          render: "Unexpected error occured. Please try again.",
          type: "error",
        });
        return;
      }
      const err = error.response?.data;

      if (!err) {
        update({
          render: "Unexpected error occured. Please try again.",
          type: "error",
        });
        return;
      }

      update({
        render: err.message || "Failed to save. Please try again.",
        type: "error",
      });
    }
  };

  const handleUpdateDisplay = (updatedDisplay: MediaDisplayType) => {
    setMediaDisplayList((prev) => {
      const updatedList = prev.results.map((medium) =>
        medium.id === updatedDisplay.id ? updatedDisplay : medium
      );
      return { ...prev, results: updatedList };
    });
  };

  useEffect(() => {
    fetchMediaDisplayList(page, pageSize);
  }, [page, pageSize]);

  return (
    <>
      <section className="mt-2">
        <CreateMediaDisplay onSuccess={addToList} />
      </section>
      <section className="mt-2">
        {isFetching ? (
          <LoadingMessage message="Fetching media displays" />
        ) : hasFetchingError ? (
          <ErrorMessage message="Something went wrong while fetching Media Displays. Please try again." />
        ) : (
          <>
            <Pagination
              pageSize={pageSize}
              page={page}
              totalPages={totalPages}
              setPageSize={setPageSize}
              setPage={setPage}
            />
            <ListMediaDisplays
              media={mediaDisplayList.results}
              handleDelete={handleDelete}
              handleUpdatePriority={handleUpdatePriority}
              handleUpdate={handleUpdateDisplay}
              handleRefresh={() => fetchMediaDisplayList(page, pageSize)}
            />
          </>
        )}
      </section>
    </>
  );
};
export default MediaDisplaysPage;
