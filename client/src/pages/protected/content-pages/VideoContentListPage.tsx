import { useEffect, useRef, useState } from "react";
import { Id } from "react-toastify";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaEye, FaTimesCircle, FaTrash } from "react-icons/fa";

import IconWithTooltip from "../../../components/IconWithTooltip";
import LoadingMessage from "../../../components/LoadingMessage";
import useLoadingToast from "../../../hooks/useLoadingToast";
import Pagination from "../../../components/Pagination";
import {
  extractReactQuillText,
  formatTimestamp,
  truncateStringVariableLen,
} from "../../../utils/formatters";
import { addTotalDuration } from "../../../utils/utils";
import { useAuth } from "../../../context/AuthProvider";

import { getListTypeInitState } from "../../../types/ListType";
import usePagination from "../../../hooks/usePagination";

import {
  PaginatedAnnouncementListTypeV1,
  AnnouncementRetrieveType,
} from "../../../types/AnnouncementTypes";
import {
  deleteVideoAnnouncementApi,
  listVideoAnnouncementApi,
} from "../../../api/announcementRequest";

const VideoContentListPage = () => {
  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { page, setPage, pageSize, setPageSize } = usePagination(
    "pageSize_videoList",
    10
  );

  const [announcements, setAnnouncements] =
    useState<PaginatedAnnouncementListTypeV1>(getListTypeInitState());
  const totalPages = Math.max(1, Math.ceil(announcements.count / pageSize));

  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnnouncements = async (ppage: number, ppageSize: number) => {
    try {
      const data = await listVideoAnnouncementApi(userApi, ppage, ppageSize);
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

  if (hasLoadingError) {
    return <div>Unexpected Error Occured. Try refreshing the page</div>;
  }

  if (isLoading) {
    return <LoadingMessage message="Loading..." />;
  }

  const handleDelete = async (announcement_id: string) => {
    const delete_conf = window.confirm(
      "Are you sure you want to delete this Video Content?"
    );

    if (!delete_conf) return;
    loading(`Deleting - ${announcement_id}. Please wait...`);

    try {
      await deleteVideoAnnouncementApi(userApi, announcement_id);
      const updatedAnnouncements = announcements.results.filter(
        (announcement) => announcement.id !== announcement_id
      );
      update({ render: "Delete successful", type: "success" });
      setAnnouncements((prev) => ({
        ...prev,
        results: updatedAnnouncements,
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
    <div className="mt-5 w-full overflow-x-auto">
      <table className="border w-full overflow-x-auto border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Start Date</th>
            <th className="px-6 py-3">End Date</th>
            <th className="px-6 py-3">Duration</th>
            <th className="px-6 py-3">Active</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>

        <tbody className="overflow-x-scroll ">
          {announcements.results.map((announcement) => (
            <TableRow
              announcement={announcement}
              handleDelete={handleDelete}
              key={announcement.id}
            />
          ))}
        </tbody>
      </table>
      {announcements.results.length === 0 && (
        <div className="w-full text-center mt-2">
          <h2 className="font-semibold">No contents can be shown.</h2>
        </div>
      )}
      <Pagination
        pageSize={pageSize}
        page={page}
        totalPages={totalPages}
        setPageSize={setPageSize}
        setPage={setPage}
      />
    </div>
  );
};
export default VideoContentListPage;

type TableRowProps = {
  announcement: AnnouncementRetrieveType;
  handleDelete: (announcement_id: string) => void;
};

function TableRow({ announcement, handleDelete }: TableRowProps) {
  return (
    <tr className="border-t hover:bg-gray-50" key={announcement.id}>
      <td className="px-6 py-3 font-bold hover:underline">
        <Link to={`/dashboard/contents/video/${announcement.id}`}>
          {announcement.id}{" "}
        </Link>
      </td>
      <td className="px-6 py-3">
        {truncateStringVariableLen(
          extractReactQuillText(announcement.title as string)
        )}
      </td>

      <td className="px-6 py-3">{formatTimestamp(announcement.start_date)}</td>
      <td className="px-6 py-3">{formatTimestamp(announcement.end_date)}</td>
      <td className="px-6 py-3">
        {announcement.video_announcement &&
          addTotalDuration(announcement.video_announcement)}
      </td>
      <td className="px-6 py-3">
        <span className="flex justify-center">
          {announcement.is_active ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaTimesCircle className="text-red-500" />
          )}
        </span>
      </td>
      <td className="px-6 py-3">
        <div className="flex flex-row gap-2">
          <span>
            <Link to={`/dashboard/contents/video/${announcement.id}`}>
              <IconWithTooltip
                icon={FaEye}
                label="View"
                iconClassName="text-btSecondary hover:text-btSecondary-hover active: active:text-btSecondary-active cursor-pointer"
                labelClassName="p-1 px-2 rounded-md shadow-md bg-btSecondary text-white"
              />
            </Link>
          </span>
          <span onClick={() => handleDelete(announcement.id)}>
            <IconWithTooltip
              icon={FaTrash}
              label="Delete"
              iconClassName="text-btDanger hover:text-btDanger-hover active: active:text-btDanger-active cursor-pointer"
              labelClassName="p-1 px-2 rounded-md shadow-md bg-btDanger text-white"
            />
          </span>
        </div>
      </td>
    </tr>
  );
}
