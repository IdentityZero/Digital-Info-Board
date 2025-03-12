import { useEffect, useRef, useState } from "react";
import CreateEvent from "../../../features/fixedContent/Events/CreateEvent";
import ListEvents from "../../../features/fixedContent/Events/ListEvents";
import { getListTypeInitState, ListType } from "../../../types/ListType";
import { UpcomingEventType } from "../../../types/FixedContentTypes";
import usePagination from "../../../hooks/usePagination";
import {
  deleteUpcomingEventApi,
  listPaginatedUpcomingEventsApi,
} from "../../../api/fixedContentRquests";
import LoadingMessage from "../../../components/LoadingMessage";
import useLoadingToast from "../../../hooks/useLoadingToast";
import { Id } from "react-toastify";
import { useAuth } from "../../../context/AuthProvider";
import Pagination from "../../../components/Pagination";

const UpcomingEventsPage = () => {
  // Todo: Error state, loading state, add list, remove list on delete
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();
  const { page, setPage, pageSize, setPageSize } = usePagination(
    "pageSize_eventsList",
    10
  );

  const [eventsList, setEventsList] = useState<ListType<UpcomingEventType>>(
    getListTypeInitState()
  );
  const totalPages = Math.max(1, Math.ceil(eventsList.count / pageSize));

  const [isFetching, setIsFetching] = useState(true);
  const [hasFetchingError, setHasFetchingError] = useState(true);

  const fetchEventsList = async (ppage: number, ppageSize: number) => {
    try {
      setHasFetchingError(false);
      setIsFetching(true);
      const res_data = await listPaginatedUpcomingEventsApi(ppage, ppageSize);
      setEventsList(res_data);
    } catch (error) {
      setHasFetchingError(true);
    } finally {
      setIsFetching(false);
    }
  };

  const addToListNewEvent = (newEvent: UpcomingEventType) => {
    setEventsList((prev) => {
      const updatedList = [newEvent, ...prev.results];

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
      await deleteUpcomingEventApi(userApi, id);
      update({
        render: "Delete successful.",
        type: "success",
      });
      setEventsList((prev) => {
        const updated = prev.results.filter((event) => event.id !== id);
        return { ...prev, results: updated, count: prev.count - 1 };
      });
    } catch (error) {
      update({
        render: "Delete failed. Please try again.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchEventsList(page, pageSize);
  }, [page, pageSize]);

  return (
    <>
      <section className="mt-2">
        <CreateEvent onSuccess={addToListNewEvent} />
      </section>
      <section className="mt-2">
        {isFetching ? (
          <LoadingMessage message="Fetching upcoming events list" />
        ) : hasFetchingError ? (
          <div className="w-full text-center">
            Error fetching upcoming events
          </div>
        ) : (
          <>
            <ListEvents
              events={eventsList.results}
              handleDelete={handleDelete}
            />
            <Pagination
              pageSize={pageSize}
              page={page}
              totalPages={totalPages}
              setPageSize={setPageSize}
              setPage={setPage}
            />
          </>
        )}
      </section>
    </>
  );
};
export default UpcomingEventsPage;
