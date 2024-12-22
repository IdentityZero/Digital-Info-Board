import {
  AnnouncementListType,
  FullImageAnnouncementType,
  FullTextAnnouncementType,
} from "../../types/AnnouncementTypes";
import { extractReactQuillText, formatTimestamp } from "../../utils/formatters";
import { addTotalDuration } from "../../utils/utils";

const ListActiveAnnouncement = ({
  activeAnnouncements,
}: {
  activeAnnouncements: AnnouncementListType;
}) => {
  if (activeAnnouncements.length === 0) {
    return <div className="w-full p-4 text-center">List is empty...</div>;
  }

  return (
    <div className="p-4 flex flex-col gap-2">
      {activeAnnouncements.map((announcement, index) => {
        if (announcement.text_announcement) {
          return (
            <TextAnnouncementCard
              key={announcement.id}
              announcement={announcement as FullTextAnnouncementType}
            />
          );
        }

        if (announcement.image_announcement) {
          return (
            <ImageAnnouncementCard
              key={announcement.id}
              announcement={announcement as FullImageAnnouncementType}
            />
          );
        }

        return <div key={index}></div>;
      })}
    </div>
  );
};

function TextAnnouncementCard({
  announcement,
}: {
  announcement: FullTextAnnouncementType;
}) {
  return (
    <div className="w-full bg-white border-2 border-black">
      <p className="w-full bg-cyanBlue p-3 capitalize font-semibold rounded-full">
        From:{" "}
        {announcement.author.first_name + " " + announcement.author.last_name}{" "}
        <span className="capitalize">
          ({announcement.author.profile.position})
        </span>
      </p>
      <div className="p-2">
        <p className="text-sm text-gray-600 flex items-start">
          <span className="font-medium min-w-[150px] block">Title:</span>
          <span>{extractReactQuillText(announcement.title as string)}</span>
        </p>
        <p className="text-sm text-gray-600 flex items-start">
          <span className="font-medium min-w-[150px] block">Display in:</span>
          <span>Main Display</span>
        </p>
        <p className="text-sm text-gray-600 flex items-start">
          <span className="font-medium min-w-[150px] block">
            Time Duration:
          </span>
          <span>{announcement.text_announcement.duration}</span>
        </p>
        <p className="text-sm text-gray-600 flex items-start">
          <span className="font-medium min-w-[150px] block">
            Display Dates:
          </span>
          <span>
            {formatTimestamp(announcement.start_date) +
              " to " +
              formatTimestamp(announcement.end_date)}
          </span>
        </p>
        <p className="text-sm text-gray-600 flex items-start">
          <span className="font-medium min-w-[150px] block">Details</span>
          <span>
            {extractReactQuillText(
              announcement.text_announcement.details as string
            )}
          </span>
        </p>
      </div>
      <div className="p-4 w-full flex flex-row justify-end gap-2">
        <a
          href={`/dashboard/contents/text/${announcement.id}`}
          target="_blank"
          className="bg-cyanBlue py-2 px-4 rounded-full"
        >
          Preview
        </a>
        <button className="bg-cyanBlue py-2 px-4 rounded-full">Approve</button>
      </div>
    </div>
  );
}

function ImageAnnouncementCard({
  announcement,
}: {
  announcement: FullImageAnnouncementType;
}) {
  return (
    <div className="w-full bg-white border-2 border-black">
      <p className="w-full bg-cyanBlue p-3 capitalize font-semibold rounded-full">
        From:{" "}
        {announcement.author.first_name + " " + announcement.author.last_name}{" "}
        <span className="capitalize">
          ({announcement.author.profile.position})
        </span>
      </p>
      <div className="p-2">
        <p className="text-sm text-gray-600 flex items-start">
          <span className="font-medium min-w-[150px] block">Title:</span>
          <span>{extractReactQuillText(announcement.title as string)}</span>
        </p>
        <p className="text-sm text-gray-600 flex items-start">
          <span className="font-medium min-w-[150px] block">Display in:</span>
          <span>Main Display</span>
        </p>
        <p className="text-sm text-gray-600 flex items-start">
          <span className="font-medium min-w-[150px] block">
            Time Duration:
          </span>
          <span>{addTotalDuration(announcement.image_announcement)}</span>
        </p>
        <p className="text-sm text-gray-600 flex items-start">
          <span className="font-medium min-w-[150px] block">
            Display Dates:
          </span>
          <span>
            {formatTimestamp(announcement.start_date) +
              " to " +
              formatTimestamp(announcement.end_date)}
          </span>
        </p>
        <div className="text-sm text-gray-600 flex items-start">
          <span className="font-medium min-w-[150px] block">Images:</span>
          <span className="flex flex-col gap-2 w-full">
            {announcement.image_announcement.map((image_announcement) => {
              const getFilename = () => {
                if (image_announcement.image instanceof File) {
                  return image_announcement.image.name;
                } else if (typeof image_announcement.image === "string") {
                  return image_announcement.image.split("/").pop();
                } else {
                  return "Invalid image format";
                }
              };

              return (
                <div
                  className="w-full flex flex-row justify-between bg-yellowishBeige p-2 border border-black"
                  key={image_announcement.id}
                >
                  <a
                    href={`${image_announcement.image}`}
                    target="_blank"
                    className="underline decoration-blue-500"
                  >
                    {getFilename()}
                  </a>
                  <p>
                    {(image_announcement.file_size / (1024 * 1024)).toFixed(2)}{" "}
                    MB
                  </p>
                </div>
              );
            })}
          </span>
        </div>
      </div>
      <div className="p-4 w-full flex flex-row justify-end gap-2">
        <a
          href={`/dashboard/contents/image/${announcement.id}`}
          target="_blank"
          className="bg-cyanBlue py-2 px-4 rounded-full"
        >
          Preview
        </a>
      </div>
    </div>
  );
}
export default ListActiveAnnouncement;
