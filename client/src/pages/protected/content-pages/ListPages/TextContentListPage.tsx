import { useEffect, useRef, useState } from "react";
import { FaEye, FaTrash, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Id } from "react-toastify";

import LoadingMessage from "../../../../components/LoadingMessage";
import ErrorMessage from "../../../../components/ErrorMessage";
import IconWithTooltip from "../../../../components/IconWithTooltip";
import Pagination from "../../../../components/Pagination";
import Table from "../../../../components/ui/Table/Table";
import Thead from "../../../../components/ui/Table/Thead";

import useLoadingToast from "../../../../hooks/useLoadingToast";
import { useAuth } from "../../../../context/AuthProvider";
import usePagination from "../../../../hooks/usePagination";

import { isNowWithinRange } from "../../../../utils/utils";
import {
  extractReactQuillText,
  formatTimestamp,
  truncateStringVariableLen,
} from "../../../../utils/formatters";

import {
  listTextAnnouncementApi,
  deleteTextAnnouncementApi,
} from "../../../../api/announcementRequest";
import {
  PaginatedAnnouncementListTypeV1,
  AnnouncementRetrieveType,
} from "../../../../types/AnnouncementTypes";
import { getListTypeInitState } from "../../../../types/ListType";

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
      <Table>
        <Thead
          headers={[
            "ID",
            "Title",
            "Details",
            "Start Date",
            "End Date",
            "Duration",
            "Approved",
            "Within Display Period",
            "Actions",
          ]}
        />
        <tbody className="overflow-x-scroll">
          {announcements.results.map((announcement) => (
            <TableRow
              key={announcement.id}
              announcement={announcement}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </Table>
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
export default TextContentListPage;

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
        {truncateStringVariableLen(
          extractReactQuillText(
            announcement.text_announcement?.details as string
          )
        )}
      </td>

      <td className="px-4 py-2 sm:px-6 sm:py-3">
        {formatTimestamp(announcement.start_date)}
      </td>
      <td className="px-4 py-2 sm:px-6 sm:py-3">
        {formatTimestamp(announcement.end_date)}
      </td>
      <td className="px-4 py-2 sm:px-6 sm:py-3">
        {announcement.text_announcement?.duration}
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
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaTimesCircle className="text-red-500" />
          )}
        </span>
      </td>
      <td className="px-4 py-2 sm:px-6 sm:py-3">
        <div className="flex flex-row gap-2 text-base">
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
