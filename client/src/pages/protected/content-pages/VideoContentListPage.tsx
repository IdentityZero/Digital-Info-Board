import { useEffect, useRef, useState } from "react";
import { Id } from "react-toastify";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaEye, FaTimesCircle, FaTrash } from "react-icons/fa";

import {
  extractReactQuillText,
  formatTimestamp,
  truncateStringVariableLen,
} from "../../../utils/formatters";
import { addTotalDuration } from "../../../utils/utils";

import IconWithTooltip from "../../../components/IconWithTooltip";
import { useAuth } from "../../../context/AuthProvider";
import { AnnouncementListType } from "../../../types/AnnouncementTypes";
import {
  deleteVideoAnnouncementApi,
  listVideoAnnouncementApi,
} from "../../../api/announcementRequest";
import LoadingMessage from "../../../components/LoadingMessage";
import useLoadingToast from "../../../hooks/useLoadingToast";

const VideoContentListPage = () => {
  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);

  const [announcements, setAnnouncements] = useState<
    AnnouncementListType | undefined
  >(undefined);

  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await listVideoAnnouncementApi(userApi);
        setAnnouncements(data);
      } catch (error) {
        setHasLoadingError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

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
      // toast.success("Deleted Successfully.");
      const updatedAnnouncements = announcements?.filter(
        (announcement) => announcement.id !== announcement_id
      );
      update({ render: "Delete successful", type: "success" });
      setAnnouncements(updatedAnnouncements);
    } catch (error) {
      update({
        render: "Delete unsuccessful. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div>
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
            {announcements?.map((announcement) => (
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

                <td className="px-6 py-3">
                  {formatTimestamp(announcement.start_date)}
                </td>
                <td className="px-6 py-3">
                  {formatTimestamp(announcement.end_date)}
                </td>
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
            ))}
          </tbody>
        </table>
        {!announcements ||
          (announcements.length === 0 && (
            <div className="w-full text-center mt-2">
              <h2 className="font-semibold">No data found...</h2>
            </div>
          ))}
      </div>
    </div>
  );
};
export default VideoContentListPage;
