import ReactQuill from "react-quill";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

import { Errortext, Form, Input } from "../../../components/ui";
import QuillEditor from "../../../components/QuillEditor";
import {
  FullVideoAnnouncementType,
  VideoAnnouncementCreateType,
} from "../../../types/AnnouncementTypes";
import { convertToDatetimeLocal } from "../../../utils/formatters";
import { forwardRef, useEffect, useState } from "react";
import { UpdateVideoAnnouncementErrorT } from "../helpers";
import { MAX_VIDEO_SIZE } from "../../../constants/api";

type EditVideoAnnouncementProps = {
  videoAnnouncementData: FullVideoAnnouncementType;
  setVideoAnnouncementData: React.Dispatch<
    FullVideoAnnouncementType | undefined
  >;
  newVideos: VideoAnnouncementCreateType[];
  setNewVideos: React.Dispatch<
    React.SetStateAction<VideoAnnouncementCreateType[]>
  >;
  submitFunc: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  errors: UpdateVideoAnnouncementErrorT;
  setErrors: React.Dispatch<
    React.SetStateAction<UpdateVideoAnnouncementErrorT>
  >;
};

const EditVideoAnnouncement = forwardRef<
  HTMLFormElement,
  EditVideoAnnouncementProps
>(
  (
    {
      videoAnnouncementData,
      setVideoAnnouncementData,
      submitFunc,
      newVideos,
      setNewVideos,
      isLoading,
      errors,
      setErrors,
    }: EditVideoAnnouncementProps,
    ref
  ) => {
    const [oldVideoDurations, setOldVideoDurations] = useState<string[]>([]);
    const [newVideoDurations, setNewVideoDurations] = useState<string[]>([]);
    const [rerenderTrigger, setRerenderTrigger] = useState(false);

    useEffect(() => {
      if (rerenderTrigger) {
        setRerenderTrigger(false);
      }
    }, [rerenderTrigger]);

    const handleTitleEditorChange = (
      __value: any,
      _delta: any,
      _source: any,
      editor: ReactQuill.UnprivilegedEditor
    ) => {
      setVideoAnnouncementData({
        ...videoAnnouncementData,
        title: JSON.stringify(editor.getContents()),
      });
    };

    const handleDurationChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      const updatedImgAnnouncementArr =
        videoAnnouncementData.video_announcement.map((item, idx) =>
          idx === index ? { ...item, duration: e.target.value } : { ...item }
        );

      setVideoAnnouncementData({
        ...videoAnnouncementData,
        video_announcement: updatedImgAnnouncementArr,
      });
    };

    const handleDeleteVideo = (index: number) => {
      const updateVideoAnnouncementArr = [
        ...videoAnnouncementData.video_announcement,
      ];
      updateVideoAnnouncementArr.splice(index, 1);
      setVideoAnnouncementData({
        ...videoAnnouncementData,
        video_announcement: updateVideoAnnouncementArr,
      });

      const newErrorMsg = [...errors.video_announcement];

      newErrorMsg.splice(index, 1);
      setErrors((prev) => ({
        ...prev,
        video_announcement: newErrorMsg,
      }));
    };

    const handleNewUploadOnChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];

      const isDuplicate = newVideos.some((existingVideos) => {
        if (!(existingVideos.video instanceof File)) return false;

        return (
          existingVideos.video.name === file.name &&
          existingVideos.video.size === file.size
        );
      });

      if (isDuplicate) {
        toast.warn("This video is already uploaded.");
        e.target.value = "";
        return;
      }

      if (file.size > MAX_VIDEO_SIZE) {
        toast.warning("File size exceeds 200MB. Upload aborted.");
        e.target.value = "";
        return;
      }

      setNewVideos((prev) => [...prev, { video: file, duration: "00:00:40" }]);
      e.target.value = "";
    };

    const handleNewVideoDurationChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      setNewVideos((prevVideos) => {
        const updatedVideos = [...prevVideos];
        updatedVideos[index].duration = e.target.value;
        return updatedVideos;
      });
    };

    const handleNewVideoDelete = (index: number) => {
      const newUploadedImages = [...newVideos];
      newUploadedImages.splice(index, 1);
      setNewVideos(newUploadedImages);
      setRerenderTrigger(true);

      const newErrorMsg = [...errors.video_announcement];
      newErrorMsg.splice(index, 1);
      setErrors((prev) => ({
        ...prev,
        video_announcement: newErrorMsg,
      }));
    };

    return (
      <div className="flex flex-col gap-4">
        <QuillEditor
          label="Announcement Title"
          id="edit-video-announcement-title"
          value={JSON.parse(videoAnnouncementData.title as string)}
          onChange={handleTitleEditorChange}
          error={errors.title}
          readonly={isLoading}
          isTitle
        />
        <Form onSubmitFunc={submitFunc} ref={ref}>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Dates */}
            <Input
              type="datetime-local"
              value={convertToDatetimeLocal(videoAnnouncementData.start_date)}
              onChange={(e) =>
                setVideoAnnouncementData({
                  ...videoAnnouncementData,
                  start_date: e.target.value,
                })
              }
              name="start_date"
              labelText="Start date"
              required
              error={errors.start_date}
              disabled={isLoading}
            />
            <Input
              type="datetime-local"
              value={convertToDatetimeLocal(videoAnnouncementData.end_date)}
              onChange={(e) =>
                setVideoAnnouncementData({
                  ...videoAnnouncementData,
                  end_date: e.target.value,
                })
              }
              name="end_date"
              labelText="End date"
              required
              error={errors.end_date}
              disabled={isLoading}
            />
          </div>

          {/* OLD VIDEOS */}
          <div className="mt-2">
            <h3 className="bg-[#6e8ea4] px-5 py-2 text-xl font-bold">
              Uploaded Videos
            </h3>

            {videoAnnouncementData.video_announcement.map((video, index) => {
              const video_file = video.video as string;

              return (
                <div
                  key={video.id}
                  className="flex flex-col md:flex-row gap-2 mt-4 bg-white dark:bg-gray-800 border rounded-lg shadow-md p-4"
                >
                  {/* Video Display */}
                  <div>
                    <video
                      controls
                      className="w-[500px] h-[280px] rounded-xl object-contain mx-auto"
                      ref={(el) => {
                        if (el) {
                          el.onloadedmetadata = () => {
                            const duration = el.duration.toFixed(2); // Get the duration in seconds
                            setOldVideoDurations((prev) => [...prev, duration]);
                          };
                        }
                      }}
                    >
                      <source src={video.video as string} />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    {/* Details */}
                    <div className="text-sm sm:text-base">
                      <p className="font-bold truncate w-full">
                        {video_file.split("/").pop()}
                      </p>
                      <p className="text-gray-500">
                        {(video.file_size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <p className="text-gray-500">
                        Video Duration: {oldVideoDurations[index]} seconds
                      </p>
                    </div>

                    {/* Duration Input */}
                    <div className="flex max-md:flex-col max-md:items-start items-center gap-2 justify-between">
                      <div className="min-w-64">
                        <Input
                          labelText="Display Duration"
                          type="text"
                          name={`video_announcement[${index}][duration]`} // This does not matter
                          value={video.duration as string}
                          onChange={(e) => handleDurationChange(e, index)}
                          error={errors.to_update[index]?.duration}
                          disabled={isLoading}
                          helpText={
                            "Duration when being displayed. Starts in 0."
                          }
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteVideo(index)}
                        className="bg-red-500 hover:bg-red-700 active:bg-red-800 p-2 rounded-lg flex gap-2 items-center text-white mt-1.5"
                        type="button"
                        disabled={isLoading}
                      >
                        <FaTrashAlt />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* NEW VIDEOS */}

          <div className="mt-2">
            <div className="w-full flex flex-col mt-5 ">
              <label
                htmlFor="create-video-file-upload"
                className="w-full flex flex-row items-center justify-center gap-2 bg-cyanBlue text-center text-xl font-bold py-2 cursor-pointer"
              >
                <FaPlusCircle className="text-3xl" />
                <span>Add Videos</span>
              </label>
              <input
                type="file"
                id="create-video-file-upload"
                className="hidden invisible"
                onChange={handleNewUploadOnChange}
                accept="video/mp4, video/mov, video/avi"
                disabled={isLoading}
              />

              {/* New Videos */}
              {!rerenderTrigger &&
                newVideos.map((video, index) => {
                  const video_file = video.video as File;
                  const videoUrl = URL.createObjectURL(video.video as File);
                  return (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row gap-2 mt-4 bg-white dark:bg-gray-800 border rounded-lg shadow-md p-4"
                    >
                      <div>
                        <video
                          controls
                          className="w-[500px] h-[280px] rounded-xl object-contain mx-auto"
                          ref={(el) => {
                            if (el) {
                              el.onloadedmetadata = () => {
                                const duration = el.duration.toFixed(2); // Get the duration in seconds
                                setNewVideoDurations((prev) => [
                                  ...prev,
                                  duration,
                                ]);
                              };
                            }
                          }}
                        >
                          <source src={videoUrl} />
                          Your browser does not support the video tag.
                        </video>
                        {errors.video_announcement[index]?.video && (
                          <Errortext
                            text={errors.video_announcement[index]?.video}
                          />
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="text-sm sm:text-base">
                          <p className="font-bold truncate w-full">
                            {video_file.name}
                          </p>
                          <p className="text-gray-500">
                            {(video_file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          <p className="text-gray-500">
                            Video Duration: {newVideoDurations[index]} seconds
                          </p>
                        </div>

                        <div className="flex max-md:flex-col max-md:items-start items-center gap-2 justify-between">
                          <div className="min-w-64">
                            <Input
                              labelText="Display Duration"
                              type="text"
                              name={`video_announcement[${index}][duration]`} // this does not matter
                              value={video.duration as string}
                              onChange={(e) =>
                                handleNewVideoDurationChange(e, index)
                              }
                              error={errors.video_announcement[index]?.duration}
                              disabled={isLoading}
                              helpText={
                                "Duration when being displayed. Starts in 0."
                              }
                            />
                          </div>
                          <button
                            onClick={() => handleNewVideoDelete(index)}
                            className="bg-red-500 hover:bg-red-700 active:bg-red-800 p-2 rounded-lg flex gap-2 items-center text-white mt-1.5"
                            type="button"
                            disabled={isLoading}
                          >
                            <FaTrashAlt />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </Form>
      </div>
    );
  }
);
export default EditVideoAnnouncement;
