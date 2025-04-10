import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Id } from "react-toastify";
import { FaCheckCircle, FaEye, FaTimesCircle, FaTrash } from "react-icons/fa";

import IconWithTooltip from "../../../components/IconWithTooltip";
import LoadingMessage from "../../../components/LoadingMessage";
import useLoadingToast from "../../../hooks/useLoadingToast";
import ErrorMessage from "../../../components/ErrorMessage";
import Pagination from "../../../components/Pagination";

import {
  extractReactQuillText,
  formatTimestamp,
  truncateStringVariableLen,
} from "../../../utils/formatters";
import { addTotalDuration, isNowWithinRange } from "../../../utils/utils";

import { useAuth } from "../../../context/AuthProvider";
import usePagination from "../../../hooks/usePagination";
import {
  listImageAnnouncementApi,
  deleteImageAnnouncementApi,
} from "../../../api/announcementRequest";

import {
  PaginatedAnnouncementListTypeV1,
  AnnouncementRetrieveType,
} from "../../../types/AnnouncementTypes";
import { getListTypeInitState } from "../../../types/ListType";

const ImageContentListPage = () => {
  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { page, setPage, pageSize, setPageSize } = usePagination(
    "pageSize_imageList",
    10
  );

  const [announcements, setAnnouncements] =
    useState<PaginatedAnnouncementListTypeV1>(getListTypeInitState());
  const totalPages = Math.max(1, Math.ceil(announcements.count / pageSize));

  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  const fetchAnnouncements = async (ppage: number, ppageSize: number) => {
    try {
      const data = await listImageAnnouncementApi(userApi, ppage, ppageSize);
      setAnnouncements(data);
    } catch (error) {
      setHasLoadingError(true);
    } finally {
      setisLoading(false);
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
      await deleteImageAnnouncementApi(userApi, announcement_id);
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

  if (hasLoadingError) {
    return (
      <div className="mt-4">
        <ErrorMessage message="Something went wrong while fetching your contents. Please try again." />
      </div>
    );
  }

  if (isLoading) {
    return <LoadingMessage message="Loading..." />;
  }

  return (
    <div className="w-full mt-5">
      <div className="overflow-x-auto">
        <table className="border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-sm sm:text-base">
              <th className="px-4 py-2 sm:px-6 sm:py-3">ID</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3">Title</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3">Start Date</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3">End Date</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3">Duration</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3">Approved</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3">Expired</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="overflow-x-scroll ">
            {announcements.results.map((announcement) => (
              <TableRow
                key={announcement.id}
                announcement={announcement}
                handleDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
        {announcements.results.length === 0 && (
          <div className="w-full text-center mt-2">
            <h2 className="font-semibold">No contents can be shown.</h2>
          </div>
        )}
      </div>
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
export default ImageContentListPage;

type TableRowProps = {
  announcement: AnnouncementRetrieveType;
  handleDelete: (announcement_id: string) => void;
};

function TableRow({ announcement, handleDelete }: TableRowProps) {
  return (
    <tr
      className="border-t hover:bg-gray-50 text-sm sm:text-base"
      key={announcement.id}
    >
      <td className="px-4 py-2 sm:px-6 sm:py-3 font-bold hover:underline">
        <Link to={`${announcement.id}`}>{announcement.id} </Link>
      </td>
      <td className="px-4 py-2 sm:px-6 sm:py-3">
        {truncateStringVariableLen(
          extractReactQuillText(announcement.title as string)
        )}
      </td>

      <td className="px-4 py-2 sm:px-6 sm:py-3">
        {formatTimestamp(announcement.start_date)}
      </td>
      <td className="px-4 py-2 sm:px-6 sm:py-3">
        {formatTimestamp(announcement.end_date)}
      </td>
      <td className="px-4 py-2 sm:px-6 sm:py-3">
        {announcement.image_announcement &&
          addTotalDuration(announcement.image_announcement)}
      </td>
      <td className="px-4 py-2 sm:px-6 sm:py-3">
        <span className="flex justify-center">
          {announcement.is_active ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaTimesCircle className="text-red-500" />
          )}
        </span>
      </td>
      <td className="px-4 py-2 sm:px-6 sm:py-3">
        <span className="flex justify-center">
          {isNowWithinRange(announcement.start_date, announcement.end_date) ? (
            <FaTimesCircle className="text-red-500" />
          ) : (
            <FaCheckCircle className="text-green-500" />
          )}
        </span>
      </td>
      <td className="px-4 py-2 sm:px-6 sm:py-3 text-base">
        <div className="flex flex-row gap-2">
          <span>
            <Link to={`${announcement.id}`}>
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
