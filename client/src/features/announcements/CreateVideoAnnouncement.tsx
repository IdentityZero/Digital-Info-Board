import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Id, toast } from "react-toastify";
import { Delta } from "quill/core";
import ReactQuill from "react-quill";
import axios from "axios";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";

import QuillEditor, { isQuillValueEmpty } from "../../components/QuillEditor";
import { Input, Form, Errortext } from "../../components/ui";

import { convertSecondsToDuration } from "../../utils/utils";
import { useAuth } from "../../context/AuthProvider";
import useLoadingToast from "../../hooks/useLoadingToast";

import {
  CreateVideoAnnouncementT,
  VideoAnnouncementCreateType,
} from "../../types/AnnouncementTypes";
import { listCreateAllTypeAnnouncementEndpoint } from "../../api/announcementRequest";
import {
  CreateVideoAnnouncementErrorState,
  VideoAnnouncementErrorT,
} from "./helpers";
import { MAX_VIDEO_SIZE } from "../../constants/api";

const CreateVideoAnnouncement = () => {
  const toastId = useRef<Id | null>(null);
  const { loading: loadingToast, update } = useLoadingToast(toastId);

  const [title, setTitle] = useState<Delta>(new Delta());
  const titleRef = useRef<ReactQuill>(null);
  const navigate = useNavigate();

  const { userApi } = useAuth();

  const [videos, setVideos] = useState<VideoAnnouncementCreateType[]>([]);
  const [videoDurations, setVideoDurations] = useState<string[]>([]);

  const MAX_UPLOAD = 5;
  const [uploadProgress, setUploadProgress] = useState(0);

  const [error, setError] = useState<VideoAnnouncementErrorT>(
    CreateVideoAnnouncementErrorState
  );
  const [loading, setLoading] = useState(false);

  // Used this because for some reason, the display of the video source is not rerendering. Used this to temporarily remove the entire video list then render again
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
    setTitle(editor.getContents());
  };

  const handleUploadOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videos.length > MAX_UPLOAD - 1) {
      toast.warning(`Maximum of ${MAX_UPLOAD} videos only`);
      return;
    }

    const files = e.target.files;
    if (!files) return;
    const file = files[0];

    const isDuplicate = videos.some((existingImage) => {
      if (!(existingImage.video instanceof File)) return false;

      return (
        existingImage.video.name === file.name &&
        existingImage.video.size === file.size
      );
    });

    if (isDuplicate) {
      toast.warning("This video is already uploaded");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      toast.warning("File size exceeds 200MB. Upload aborted.");
      e.target.value = "";
      return;
    }

    setVideos((prev) => [...prev, { video: file, duration: "00:00:40" }]);

    e.target.value = "";
  };

  const handleDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setVideos((prevVideos) => {
      const updatedVideos = [...prevVideos];
      updatedVideos[index].duration = e.target.value;
      return updatedVideos;
    });
  };

  const handleDeleteUpload = (index: number) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);

    const newVideoDurations = [...videoDurations];
    newVideoDurations.splice(index, 1);
    setVideoDurations(newVideoDurations);

    setRerenderTrigger(true);

    const newErrorMsg = [...error.video_announcement];
    newErrorMsg.splice(index, 1);
    setError((prev) => ({
      ...prev,
      video_announcement: newErrorMsg,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isQuillValueEmpty(title) && titleRef.current?.editor) {
      titleRef.current.editor.focus();
      setError((prev) => ({
        ...prev,
        title: "Title cannot be empty.",
      }));
      toast.warning("Title cannot be empty.");
      return;
    }

    if (videos.length === 0) {
      toast.warning("Contents cannot be empty.");
      return;
    }

    const fd = new FormData(e.currentTarget);

    const obj_data = Object.fromEntries(fd.entries());

    const newVideoAnnData: CreateVideoAnnouncementT = {
      title: JSON.stringify(title),
      start_date: obj_data["start_date"] as string,
      end_date: obj_data["end_date"] as string,
      video_announcement: videos,
    };

    loadingToast("Saving content...");

    try {
      setLoading(true);
      setError(CreateVideoAnnouncementErrorState);
      const res = await userApi.post(
        listCreateAllTypeAnnouncementEndpoint,
        newVideoAnnData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress({ progress }) {
            if (progress) {
              setUploadProgress(progress * 100);
            }
          },
        }
      );
      const form = e.target as HTMLFormElement;
      setTitle(new Delta());
      setVideos([]);
      setVideoDurations([]);
      form.reset();
      update({ render: "Video Content Created", type: "success" });
      const redirect_conf = confirm(
        "New Image Announcement has been created. Do you want to be redirected to the Annoucement?"
      );

      if (redirect_conf) {
        navigate(`/dashboard/contents/video/${res.data.id}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data;
        if (!err) {
          update({
            render: "Unexpected error occured. Please try again.",
            type: "error",
          });
          return;
        }
        setError((prev) => ({
          ...prev,
          ...err,
        }));
        update({
          render: "Please check errors before submitting.",
          type: "warning",
        });
      } else {
        update({
          render: "Unexpected error occured. Please try again.",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="p-2 md:p-3">
      <Form onSubmitFunc={handleSubmit}>
        <QuillEditor
          id="image-title"
          label="Announcement Title"
          value={title}
          onChange={handleTitleEditorChange}
          readonly={loading}
          ref={titleRef}
          error={error.title}
          placeholder="Create a title for your announcement"
          isTitle
        />
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input
            type="datetime-local"
            name="start_date"
            labelText="Start date"
            required
            disabled={loading}
            error={error.start_date}
          />
          <Input
            type="datetime-local"
            name="end_date"
            labelText="End date"
            required
            disabled={loading}
            error={error.end_date}
          />
        </div>
        <div className="w-full flex flex-col mt-5 ">
          <label
            htmlFor="create-image-file-upload"
            className="w-full flex flex-row items-center justify-center gap-2 bg-cyanBlue text-center text-xl font-bold py-2 cursor-pointer"
          >
            <FaPlusCircle className="text-3xl" />
            <span>Add Videos</span>
          </label>
          <input
            type="file"
            id="create-image-file-upload"
            className="hidden invisible"
            onChange={handleUploadOnchange}
            accept="video/mp4, video/mov, video/avi"
            disabled={loading}
          />
        </div>
        <div>
          {videos.length === 0 && (
            <div className="w-full text-center">No video uploaded yet...</div>
          )}
          <div
            className={`w-full text-center relative my-2 rounded-xl overflow-hidden ${
              uploadProgress <= 0 ? "hidden" : "border-2 border-black"
            }`}
          >
            <div
              className={`bg-cyanBlue-light  absolute h-full -z-1`}
              style={{ width: `${uploadProgress.toFixed(0)}%` }}
            />
            <p className="relative z-10">{uploadProgress.toFixed(2)}%</p>
          </div>

          {!rerenderTrigger &&
            videos.map((video, index) => {
              const video_file = video.video as File;
              const videoUrl = URL.createObjectURL(video.video as File);

              return (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-2 mt-4 bg-white dark:bg-gray-800 border rounded-lg shadow-md p-4"
                >
                  <div>
                    {/* Video File */}
                    <video
                      controls
                      className="w-[500px] h-[280px] rounded-xl object-contain mx-auto"
                      ref={(el) => {
                        if (el) {
                          el.onloadedmetadata = () => {
                            const duration = el.duration; // Get the duration in seconds
                            setVideoDurations((prev) => [
                              ...prev,
                              duration.toFixed(2),
                            ]);

                            setVideos((prev) =>
                              prev.map((video, i) =>
                                i === index
                                  ? {
                                      ...video,
                                      duration:
                                        convertSecondsToDuration(duration),
                                    }
                                  : video
                              )
                            );
                          };
                        }
                      }}
                    >
                      <source type={video_file.type} src={videoUrl} />
                      Your browser does not support the video tag.
                    </video>

                    {/* Error Text */}
                    {error.video_announcement[index]?.video && (
                      <Errortext
                        text={error.video_announcement[index]?.video}
                      />
                    )}
                  </div>

                  {/* Meta data */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="text-sm sm:text-base">
                      <p className="font-bold truncate w-full">
                        {video_file.name}
                      </p>
                      <p className="text-gray-500">
                        {(video_file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <p
                        className="text-gray-500"
                        // id={`duration-${video_file.name}-${video_file.size}`}
                      >
                        Video Duration: {videoDurations[index]} seconds
                      </p>
                    </div>

                    {/* Duration */}
                    <div className="flex max-md:flex-col max-md:items-start items-center gap-2 justify-between">
                      <div className="min-w-64">
                        <Input
                          labelText="Display Duration"
                          type="text"
                          name={`image_announcement[${index}][duration]`}
                          value={video.duration as string}
                          onChange={(e) => handleDurationChange(e, index)}
                          error={error.video_announcement[index]?.duration}
                          disabled={loading}
                          helpText={
                            "Duration when being displayed. Starts in 0."
                          }
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteUpload(index)}
                        className="bg-red-500 hover:bg-red-700 active:bg-red-800 p-2 rounded-lg flex gap-2 items-center text-white mt-1.5"
                        type="button"
                        disabled={loading}
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
        <div className="w-full mt-2 flex justify-end">
          <button
            className={`px-10 py-2 rounded-full border border-black mr-2 ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-lightBlue hover:bg-lightBlue-300 active:bg-lightBlue-500"
            }`}
            type="submit"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </Form>
    </div>
  );
};
export default CreateVideoAnnouncement;
