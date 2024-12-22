import { useEffect, useState } from "react";
import { FaEye, FaTrash, FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

import { AnnouncementListType } from "../../../types/AnnouncementTypes";
import { useAuth } from "../../../context/AuthProvider";
import {
  extractReactQuillText,
  formatTimestamp,
  truncateStringVariableLen,
} from "../../../utils/formatters";
import IconWithTooltip from "../../../components/IconWithTooltip";

import {
  listTextAnnouncementApi,
  deleteTextAnnouncementApi,
} from "../../../api/announcementRequest";

const TextContentListPage = () => {
  const [announcements, setAnnouncements] = useState<
    AnnouncementListType | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { userApi } = useAuth();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const data = await listTextAnnouncementApi(userApi);

        setAnnouncements(data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleDelete = async (announcement_id: string) => {
    const confirm_delete = confirm(
      `Are you sure you want to delete this Announcement?`
    );

    if (!confirm_delete) return;

    try {
      await deleteTextAnnouncementApi(userApi, announcement_id);
      alert("Deleted successfully.");
      // Remove the data
      const updated = announcements?.filter(
        (announcement) => announcement.id !== announcement_id
      );
      setAnnouncements(updated);
    } catch (error) {
      alert("Unexpected error occured. Please try again.");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mt-5 w-full overflow-x-auto">
      <table className="border w-full overflow-x-auto border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Details</th>
            <th className="px-6 py-3">Start Date</th>
            <th className="px-6 py-3">End Date</th>
            <th className="px-6 py-3">Duration</th>
            <th className="px-6 py-3">Active</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="overflow-x-scroll">
          {announcements?.map((announcement) => (
            <tr className="border-t hover:bg-gray-50" key={announcement.id}>
              <td className="px-6 py-3 font-bold hover:underline">
                <Link to={`${announcement.id}`}>{announcement.id} </Link>
              </td>
              <td className="px-6 py-3">
                {truncateStringVariableLen(
                  extractReactQuillText(announcement.title as string)
                )}
              </td>
              <td className="px-6 py-3">
                {truncateStringVariableLen(
                  extractReactQuillText(
                    announcement.text_announcement?.details as string
                  )
                )}
              </td>

              <td className="px-6 py-3">
                {formatTimestamp(announcement.start_date)}
              </td>
              <td className="px-6 py-3">
                {formatTimestamp(announcement.end_date)}
              </td>
              <td className="px-6 py-3">
                {announcement.text_announcement?.duration}
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
  );
};
export default TextContentListPage;
