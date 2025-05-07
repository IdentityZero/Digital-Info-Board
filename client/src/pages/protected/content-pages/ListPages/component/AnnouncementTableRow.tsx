import { Link } from "react-router-dom";
import { FaCheckCircle, FaEye, FaTimesCircle, FaTrash } from "react-icons/fa";

import IconWithTooltip from "../../../../../components/IconWithTooltip";

import {
  extractReactQuillText,
  formatTimestamp,
  truncateStringVariableLen,
} from "../../../../../utils/formatters";
import {
  addTotalDuration,
  getAnnouncementType,
  isNowWithinRange,
} from "../../../../../utils/utils";

import { AnnouncementRetrieveType } from "../../../../../types/AnnouncementTypes";

type AnnouncementTableRowProps = {
  announcement: AnnouncementRetrieveType;
  handleDelete: (announcement_id: string) => void;
};

const AnnouncementTableRow = ({
  announcement,
  handleDelete,
}: AnnouncementTableRowProps) => {
  const type = getAnnouncementType(announcement);

  return (
    <tr
      className="border-t hover:bg-gray-50 text-sm sm:text-base"
      key={announcement.id}
    >
      <td className="px-4 py-2 sm:px-6 sm:py-3 font-bold hover:underline">
        <Link to={`/dashboard/contents/${type}/${announcement.id}`}>
          {announcement.id}{" "}
        </Link>
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
        {announcement.text_announcement &&
          announcement.text_announcement?.duration}
        {announcement.image_announcement &&
          announcement.image_announcement.length > 0 &&
          addTotalDuration(announcement.image_announcement)}
        {announcement.video_announcement &&
          announcement.video_announcement.length > 0 &&
          addTotalDuration(announcement.video_announcement)}
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
      <td className="px-4 py-2 sm:px-6 sm:py-3 text-base">
        <div className="flex flex-row gap-2">
          <span>
            <Link to={`/dashboard/contents/${type}/${announcement.id}`}>
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
};
export default AnnouncementTableRow;
