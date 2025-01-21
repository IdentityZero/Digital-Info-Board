import ReactQuill from "react-quill";

import { Form, Input } from "../../components/ui";
import QuillEditor from "../../components/QuillEditor";
import {
  FullVideoAnnouncementType,
  VideoAnnouncementCreateType,
} from "../../types/AnnouncementTypes";
import {
  convertToDatetimeLocal,
  truncateStringVariableLen,
} from "../../utils/formatters";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { forwardRef, useEffect, useState } from "react";
import { UpdateVideoAnnouncementErrorT } from "./helpers";

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
        alert("This video is already uploaded");
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
          <div className="flex flex-wrap gap-2">
            <div className="basis-[calc(50%-0.5rem)]">
              <Input
                type="datetime-local"
                ctrl_type="controlled"
                inputValue={convertToDatetimeLocal(
                  videoAnnouncementData.start_date
                )}
                setInputValue={(e) =>
                  setVideoAnnouncementData({
                    ...videoAnnouncementData,
                    start_date: e.target.value,
                  })
                }
                name="start_date"
                label="Start date"
                required
                error={errors.start_date}
                disabled={isLoading}
              />
            </div>
            <div className="basis-[calc(50%-0.5rem)]">
              <Input
                type="datetime-local"
                ctrl_type="controlled"
                inputValue={convertToDatetimeLocal(
                  videoAnnouncementData.end_date
                )}
                setInputValue={(e) =>
                  setVideoAnnouncementData({
                    ...videoAnnouncementData,
                    end_date: e.target.value,
                  })
                }
                name="end_date"
                label="End date"
                required
                error={errors.end_date}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* OLD VIDEOS */}
          <div className="mt-2">
            <h3 className="bg-[#6e8ea4] px-5 py-2 text-xl font-bold">
              Uploaded Videos
            </h3>
            <div className="flex flex-col gap-4 mt-2">
              {videoAnnouncementData.video_announcement.map((video, index) => {
                const video_file = video.video as string;

                return (
                  <div key={video.id} className="flex gap-4">
                    {/* Video Display */}
                    <video
                      controls
                      className="w-[500px] h-[280px] rounded-xl"
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

                    <div className="flex-1 flex flex-col justify-between">
                      {/* Details */}
                      <div>
                        <p className="font-bold">
                          {truncateStringVariableLen(
                            video_file.split("/").pop() as string,
                            50,
                            50
                          )}
                        </p>
                        <p className="text-gray-500">
                          {(video.file_size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <p className="text-gray-500">
                          Video Duration: {oldVideoDurations[index]} seconds
                        </p>
                      </div>

                      {/* Duration Input */}
                      <div className="flex items-center justify-between">
                        <div className="w-64">
                          <Input
                            ctrl_type="controlled"
                            label="Display Duration"
                            type="text"
                            name={`video_announcement[${index}][duration]`} // This does not matter
                            inputValue={video.duration as string}
                            setInputValue={(e) =>
                              handleDurationChange(e, index)
                            }
                            error={errors.to_update[index]?.duration}
                            disabled={isLoading}
                            helpText={
                              "Duration when being displayed. Starts in 0."
                            }
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteVideo(index)}
                          className="bg-red-500 hover:bg-red-700 active:bg-red-800 p-2 rounded-lg flex gap-2 items-center text-white"
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
              {!rerenderTrigger &&
                newVideos.map((video, index) => {
                  const video_file = video.video as File;
                  const videoUrl = URL.createObjectURL(video.video as File);
                  return (
                    <div key={index} className="flex gap-2 mt-2">
                      <video
                        controls
                        className="w-[500px] h-[280px] rounded-xl"
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

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-bold">
                            {truncateStringVariableLen(video_file.name, 50, 50)}
                          </p>
                          <p className="text-gray-500">
                            {(video_file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          <p className="text-gray-500">
                            Video Duration: {newVideoDurations[index]} seconds
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="w-64">
                            <Input
                              ctrl_type="controlled"
                              label="Display Duration"
                              type="text"
                              name={`video_announcement[${index}][duration]`} // this does not matter
                              inputValue={video.duration as string}
                              setInputValue={(e) =>
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
                            className="bg-red-500 hover:bg-red-700 active:bg-red-800 p-2 rounded-lg flex gap-2 items-center text-white"
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
