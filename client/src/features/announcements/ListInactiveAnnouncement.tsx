import { extractReactQuillText, formatTimestamp } from "../../utils/formatters";
import { addTotalDuration } from "../../utils/utils";
import {
  type AnnouncementListType,
  type FullTextAnnouncementType,
  type FullImageAnnouncementType,
} from "../../types/AnnouncementTypes";
import { updateAnnouncementApi } from "../../api/announcementRequest";
import { useAuth } from "../../context/AuthProvider";

type ListInactiveAnnouncementProps = {
  inactiveAnnouncements: AnnouncementListType;
  setActiveAnnouncements: React.Dispatch<
    React.SetStateAction<AnnouncementListType>
  >;
  setInactiveAnnouncements: React.Dispatch<
    React.SetStateAction<AnnouncementListType>
  >;
};

const ListInactiveAnnouncement = ({
  inactiveAnnouncements,
  setActiveAnnouncements,
  setInactiveAnnouncements,
}: ListInactiveAnnouncementProps) => {
  const { userApi } = useAuth();

  if (inactiveAnnouncements.length === 0) {
    return <div className="w-full p-4 text-center">List is empty...</div>;
  }

  const handleApproveClick = async (id: string, data: any) => {
    const approve_confirm = window.confirm(
      "Are you sure you want to approve this Content?"
    );

    if (!approve_confirm) return;
    // #TODO
    try {
      const rest_data = await updateAnnouncementApi(userApi, id, data);
      console.log(rest_data);
      const updatedData = inactiveAnnouncements.find(
        (announcement) => announcement.id === id
      );
      if (updatedData) {
        setActiveAnnouncements((prev) => [...prev, updatedData]);
        const updatedInActiveList = [
          inactiveAnnouncements.filter(
            (announcement) => announcement.id !== id
          ),
        ][0];

        setInactiveAnnouncements(updatedInActiveList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      {inactiveAnnouncements.map((announcement, index) => {
        if (announcement.text_announcement) {
          return (
            <TextAnnouncementCard
              key={announcement.id}
              announcement={announcement as FullTextAnnouncementType}
              handleApproveClick={handleApproveClick}
            />
          );
        }

        if (announcement.image_announcement) {
          return (
            <ImageAnnouncementCard
              key={announcement.id}
              announcement={announcement as FullImageAnnouncementType}
              handleApproveClick={handleApproveClick}
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
  handleApproveClick,
}: {
  announcement: FullTextAnnouncementType;
  handleApproveClick: (id: string, data: any) => void;
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
        <button
          onClick={() => {
            const data = {
              title: announcement.title,
              start_date: announcement.start_date,
              end_date: announcement.end_date,
              is_active: true,
            };
            handleApproveClick(announcement.id, data);
          }}
          className="bg-cyanBlue py-2 px-4 rounded-full"
        >
          Approve
        </button>
      </div>
    </div>
  );
}

function ImageAnnouncementCard({
  announcement,
  handleApproveClick,
}: {
  announcement: FullImageAnnouncementType;
  handleApproveClick: (id: string, data: any) => void;
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
        <button
          onClick={() => {
            const data = {
              title: announcement.title,
              start_date: announcement.start_date,
              end_date: announcement.end_date,
              is_active: true,
            };
            handleApproveClick(announcement.id, data);
          }}
          className="bg-cyanBlue py-2 px-4 rounded-full"
        >
          Approve
        </button>
      </div>
    </div>
  );
}

export default ListInactiveAnnouncement;
