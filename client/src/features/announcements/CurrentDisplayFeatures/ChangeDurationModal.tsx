import { useRef, useState } from "react";
import axios from "axios";
import { Id } from "react-toastify";

import Modal from "../../../components/ui/Modal";
import { Button, Input } from "../../../components/ui";
import {
  extractReactQuillText,
  truncateStringVariableLen,
} from "../../../utils/formatters";

import { useAuth } from "../../../context/AuthProvider";
import useLoadingToast from "../../../hooks/useLoadingToast";

import {
  AnnouncementRetrieveType,
  TextAnnouncementType,
} from "../../../types/AnnouncementTypes";

import {
  convertSecondsToDuration,
  filterListObjectKeys,
  getAnnouncementType,
} from "../../../utils/utils";
import {
  updateImageAnnouncementApi,
  updateTextAnnouncementApi,
  updateVideoAnnouncementApi,
} from "../../../api/announcementRequest";

type ChangeDurationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  announcementData: AnnouncementRetrieveType;
};

type ContentTypes = "image" | "video" | "text";

const requestMaps = {
  text: updateTextAnnouncementApi,
  image: updateImageAnnouncementApi,
  video: updateVideoAnnouncementApi,
};

const ChangeDurationModal = ({
  isOpen,
  onClose,
  announcementData,
}: ChangeDurationModalProps) => {
  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);

  const [data, setData] = useState(structuredClone(announcementData));
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [videoDurations, setVideoDurations] = useState<string[]>([]);

  const handleDurationChange = (
    value: string,
    index: number,
    type: "image" | "video"
  ) => {
    if (type === "image") {
      setData((prev) => ({
        ...prev,
        image_announcement: prev.image_announcement?.map((item, idx) =>
          idx === index ? { ...item, duration: value } : { ...item }
        ),
      }));
    } else if (type === "video") {
      setData((prev) => ({
        ...prev,
        video_announcement: prev.video_announcement?.map((item, idx) =>
          idx === index ? { ...item, duration: value } : { ...item }
        ),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const type: ContentTypes = getAnnouncementType(data);

    let to_update;

    if (type === "image" || type === "video") {
      to_update = filterListObjectKeys(
        type === "image" ? data.image_announcement : data.video_announcement,
        ["id", "duration"]
      );
    }

    const updatedAnnouncement = {
      title: data.title,
      start_date: data.start_date,
      end_date: data.end_date,
      text_announcement: { ...data.text_announcement },
      to_update: to_update,
    };

    updateAnnouncement(type, updatedAnnouncement);
  };

  const updateAnnouncement = async (type: ContentTypes, updatedData: any) => {
    const updateFunction = requestMaps[type];

    if (!updateFunction) {
      console.error("Invalid content type");
      return;
    }
    loading("Saving updates. Please wait...");
    try {
      setIsLoading(true);
      await updateFunction(userApi, data.id, updatedData);
      update({
        render: "Update succesful. ",
        type: "success",
      });
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        update({
          render: "Unexpected error occured. Please try again later.",
          type: "error",
        });
        return;
      }
      const err = error.response?.data;
      if (!err) {
        update({
          render: "Unexpected error occured. Please try again later.",
          type: "error",
        });
        return;
      }
      console.log(err);

      update({
        render: "Update errors and try again.",
        type: "warning",
      });
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose()}
      size="xl"
      title={extractReactQuillText(announcementData.title as string)}
    >
      <form onSubmit={handleSubmit}>
        {/* Text */}
        {data.text_announcement && (
          <Input
            error={error && error.text_announcement.duration}
            disabled={isLoading}
            labelText="Duration"
            required
            value={data.text_announcement.duration as string}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                text_announcement: {
                  ...(prev.text_announcement as TextAnnouncementType),
                  duration: e.target.value,
                },
              }))
            }
          />
        )}

        {/* Image */}
        {data.image_announcement && data.image_announcement.length > 0 && (
          <div>
            {data.image_announcement.map((image, index) => {
              const image_file = image.image as string;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 py-3 mb-2 border-t-2 border-b-2 border-gray-500"
                >
                  <span className="flex-1">
                    <img
                      src={image_file}
                      alt={`Uploaded ${index}`}
                      className="w-[150px] h-[150px] object-contain"
                    />
                  </span>
                  <span className=" flex-1 text-center">
                    {image_file.split("/").pop()}
                  </span>
                  <span className="flex-1 text-center">
                    <Input
                      error={error && error.to_update[index]?.duration}
                      disabled={isLoading}
                      required
                      labelText=""
                      type="text"
                      name={`image_announcement[${index}][duration]`} // This does not matter
                      value={image.duration as string}
                      onChange={(e) =>
                        handleDurationChange(e.target.value, index, "image")
                      }
                    />
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Video */}
        {data.video_announcement && data.video_announcement.length > 0 && (
          <div>
            {data.video_announcement.map((video, index) => {
              const video_file = video.video as string;

              return (
                <div key={video.id} className="flex gap-4">
                  {/* Video Display */}
                  <video
                    controls
                    className="w-[150px] h-[150px] object-contain"
                    ref={(el) => {
                      if (el) {
                        el.onloadedmetadata = () => {
                          const duration = el.duration; // Get the duration in seconds
                          setVideoDurations((prev) => [
                            ...prev,
                            convertSecondsToDuration(duration),
                          ]);
                        };
                      }
                    }}
                  >
                    <source src={video.video as string} />
                    Your browser does not support the video tag.
                  </video>

                  <div className="flex-1 flex flex-col justify-between">
                    {/* Details */}
                    <div>
                      <p className="font-bold">
                        {truncateStringVariableLen(
                          video_file.split("/").pop() as string,
                          45,
                          45
                        )}
                      </p>
                    </div>

                    {/* Duration Input */}
                    <div className="flex items-center justify-between">
                      <Input
                        disabled={isLoading}
                        required
                        labelText="Display Duration"
                        type="text"
                        name={`video_announcement[${index}][duration]`} // This does not matter
                        value={video.duration as string}
                        onChange={(e) =>
                          handleDurationChange(e.target.value, index, "video")
                        }
                        error={error && error.to_update[index]?.duration}
                        helpText={"Duration when being displayed. Starts in 0."}
                      />
                      <div className="mt-2">
                        <Button
                          disabled={isLoading}
                          onClick={() => {
                            if (videoDurations.length === 0) return;
                            handleDurationChange(
                              videoDurations[index],
                              index,
                              "video"
                            );
                          }}
                        >
                          Video length
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="text-right mt-2">
          <Button disabled={isLoading}>
            {isLoading ? "Saving" : "Submit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default ChangeDurationModal;
