import { useEffect, useRef, useState } from "react";
import { Id } from "react-toastify";

import LoadingOrErrorWrapper from "../../../../components/LoadingOrErrorWrapper";
import Table from "../../../../components/ui/Table/Table";
import Thead from "../../../../components/ui/Table/Thead";

import usePagination from "../../../../hooks/usePagination";
import useLoadingToast from "../../../../hooks/useLoadingToast";
import { useAuth } from "../../../../context/AuthProvider";

import { getListTypeInitState, ListType } from "../../../../types/ListType";
import { UrgentAnnouncementType } from "../../../../types/AnnouncementTypes";

import {
  deleteUrgentAnnouncementApi,
  listPaginatedUrgentAnnouncementApi,
} from "../../../../api/announcementRequest";
import {
  extractReactQuillText,
  truncateStringVariableLen,
} from "../../../../utils/formatters";
import IconWithTooltip from "../../../../components/IconWithTooltip";
import { FaEye, FaTrash } from "react-icons/fa";
import Pagination from "../../../../components/Pagination";
import { Link } from "react-router-dom";

const UrgentContentListPage = () => {
  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { page, setPage, pageSize, setPageSize } = usePagination(
    "pageSize_urgentList",
    10
  );

  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [announcements, setAnnouncements] = useState<
    ListType<UrgentAnnouncementType>
  >(getListTypeInitState());
  const totalPages = Math.max(1, Math.ceil(announcements.count / pageSize));

  const fetchAnnouncements = async (ppage: number, ppageSize: number) => {
    try {
      setIsLoading(true);
      const data = await listPaginatedUrgentAnnouncementApi(
        userApi,
        ppage,
        ppageSize
      );
      setAnnouncements(data);
    } catch (error) {
      setHasLoadingError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (announcement_id: number) => {
    const conf = confirm("Are you sure you want to delete this?");

    if (!conf) return;

    loading(`Deleting - ${announcement_id}. Please wait...`);
    try {
      await deleteUrgentAnnouncementApi(userApi, announcement_id);
      update({ render: "Delete successful", type: "success" });
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

  useEffect(() => {
    fetchAnnouncements(page, pageSize);
  }, [page, pageSize]);
  return (
    <LoadingOrErrorWrapper isLoading={isLoading} hasError={hasLoadingError}>
      <div className="mt-5">
        <Table>
          <Thead
            headers={["ID", "Title", "Description", "Duration", "Actions"]}
          />
          <tbody className="overflow-x-scroll ">
            {announcements.results.map((announcement) => (
              <tr key={announcement.id}>
                <td className="px-4 py-2 sm:px-6 sm:py-3 font-bold hover:underline">
                  <Link to={`/dashboard/contents/urgent/${announcement.id}`}>
                    {announcement.id}{" "}
                  </Link>
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-3">
                  {truncateStringVariableLen(
                    extractReactQuillText(JSON.stringify(announcement.title)),
                    100,
                    100
                  )}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-3">
                  {truncateStringVariableLen(
                    extractReactQuillText(
                      JSON.stringify(announcement.description)
                    ),
                    100,
                    100
                  )}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-3">
                  {announcement.duration}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-3 text-base">
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <span>
                      <Link
                        to={`/dashboard/contents/urgent/${announcement.id}`}
                      >
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
    </LoadingOrErrorWrapper>
  );
};
export default UrgentContentListPage;
