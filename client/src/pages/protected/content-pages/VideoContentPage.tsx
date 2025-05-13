import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import ErrorMessage from "../../../components/ErrorMessage";

import {
  FullVideoAnnouncementType,
  VideoAnnouncementCreateType,
} from "../../../types/AnnouncementTypes";
import { useAuth } from "../../../context/AuthProvider";
import {
  deleteVideoAnnouncementApi,
  retrieveVideoAnnouncementApi,
  updateVideoAnnouncementApi,
} from "../../../api/announcementRequest";
import {
  EditVideoAnnouncement,
  RetrieveVideoAnnouncement,
} from "../../../features/announcements";
import {
  filterListObjectKeys,
  getRemovedId,
  isObjectEqual,
} from "../../../utils/utils";
import { isQuillValueEmpty } from "../../../components/QuillEditor";
import { UpdateVideoAnnouncementErrorState } from "../../../features/announcements/helpers";
import LoadingMessage from "../../../components/LoadingMessage";
import { Id } from "react-toastify";
import useLoadingToast from "../../../hooks/useLoadingToast";

const VideoContentPage = () => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { id } = useParams();
  const { userApi } = useAuth();
  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [videoAnnouncement, setVideoAnnouncement] = useState<
    FullVideoAnnouncementType | undefined
  >(undefined);
  const [videoAnnouncementForEdit, setVideoAnnouncementForEdit] = useState<
    FullVideoAnnouncementType | undefined
  >(undefined);
  const [newVideos, setNewVideos] = useState<VideoAnnouncementCreateType[]>([]);

  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveErrors, setSaveErrors] = useState(
    UpdateVideoAnnouncementErrorState
  );

  useEffect(() => {
    const fetchAnnouncementData = async () => {
      try {
        const res_data = await retrieveVideoAnnouncementApi(
          userApi,
          id as string
        );
        setVideoAnnouncement(res_data);
        setVideoAnnouncementForEdit(res_data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 404) {
            setFetchError("No data found...");
            return;
          }
        }
        setFetchError("Unexpected error occured. Please try again.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchAnnouncementData();
  }, []);

  const handleDelete = async () => {
    const delete_conf = confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!delete_conf || !videoAnnouncement) return;
    loading("Deleting. Please wait...");

    try {
      setDeleteLoading(true);
      await deleteVideoAnnouncementApi(userApi, videoAnnouncement.id as string);
      update({ render: "Delete successful", type: "success" });
      navigate("/dashboard/contents/video");
    } catch (error) {
      update({
        render: "Delete unsuccessful. Please try again.",
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isObjectEqual(videoAnnouncement, videoAnnouncementForEdit)) {
      const cancelConf = confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost"
      );

      if (!cancelConf) return;
    }

    setVideoAnnouncementForEdit(videoAnnouncement);
    setIsEditMode(false);
    setIsEditMode(false);
    setSaveErrors(UpdateVideoAnnouncementErrorState);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const obj_data = Object.fromEntries(fd.entries());

    // Error handling
    if (
      isQuillValueEmpty(JSON.parse(videoAnnouncementForEdit?.title as string))
    ) {
      toast.warn("Title cannot be empty.");
      return;
    }

    if (videoAnnouncementForEdit?.video_announcement.length === 0) {
      toast.warn("Videos cannot be empty.");
      return;
    }

    const updated_announcement = {
      title: videoAnnouncementForEdit?.title,
      start_date: obj_data.start_date,
      end_date: obj_data.end_date,
      to_delete: JSON.stringify(
        getRemovedId(
          videoAnnouncement?.video_announcement,
          videoAnnouncementForEdit?.video_announcement
        )
      ),
      to_update: filterListObjectKeys(
        videoAnnouncementForEdit?.video_announcement,
        ["id", "duration"]
      ),
      video_announcement: newVideos,
    };

    loading("Saving updates. Please wait...");

    try {
      setSaveLoading(true);
      const res_data = await updateVideoAnnouncementApi(
        userApi,
        videoAnnouncement?.id as string,
        updated_announcement
      );
      setVideoAnnouncement(res_data);
      setVideoAnnouncementForEdit(res_data);
      setIsEditMode(false);
      setSaveErrors(UpdateVideoAnnouncementErrorState);
      setNewVideos([]);
      update({ render: "Update successful", type: "success" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data;

        if (!err) {
          update({
            render: "Update unsuccessful. Please try again.",
            type: "error",
          });
          return;
        }
        setSaveErrors((prev) => ({
          ...prev,
          ...err,
        }));
        update({
          render: "Please check errors before submitting.",
          type: "warning",
        });
      } else {
        update({
          render: "Update unsuccessful. Please try again.",
          type: "error",
        });
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveButton = () => {
    if (!formRef.current) return;
    formRef.current.requestSubmit();
  };

  if (videoAnnouncement?.video_announcement.length === 0) {
    return (
      <div className="mt-2 flex flex-col items-center justify-center gap-2">
        <ErrorMessage message="Error could be because data does not resemble as Video Content" />
        <Link to="/dashboard/contents/video">
          <button
            className={`flex flex-row items-center gap-2 px-8 py-1 rounded-full border border-black bg-lightBlue hover:bg-lightBlue-300 active:bg-lightBlue-500 `}
          >
            <FaArrowLeft />
            Back to list
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-5">
      <div className="w-full flex flex-col sm:flex-row items-start justify-between gap-y-2">
        <Link to="/dashboard/contents/video">
          <button
            className="flex flex-row items-center gap-2 px-8 py-1 rounded-full border border-black bg-lightBlue hover:bg-lightBlue-300 active:bg-lightBlue-500"
            disabled={deleteLoading || saveLoading}
          >
            <FaArrowLeft />
            Back
          </button>
        </Link>
        <div className="flex flex-row items-center gap-4">
          {!fetchError &&
            (isEditMode ? (
              <>
                <button
                  className="flex flex-row items-center gap-2 px-6 py-1 rounded-full border border-black bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
                  onClick={handleSaveButton}
                  disabled={deleteLoading || saveLoading}
                >
                  <FaSave />
                  {saveLoading ? "Saving..." : "Save"}
                </button>
                <button
                  className="flex flex-row items-center gap-2 px-6 py-1 rounded-full border border-black bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700"
                  onClick={handleCancel}
                  disabled={deleteLoading || saveLoading}
                >
                  <FaTimes />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="flex flex-row items-center gap-2 px-6 py-1 rounded-full border border-black bg-green-500 text-white hover:bg-green-600 active:bg-green-700"
                  onClick={() => setIsEditMode(true)}
                  disabled={deleteLoading || saveLoading}
                >
                  <FaEdit />
                  Edit
                </button>
                <button
                  className="flex flex-row items-center gap-2 px-6 py-1 rounded-full border border-black bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
                  onClick={handleDelete}
                  disabled={deleteLoading || saveLoading}
                >
                  <FaTrashAlt />
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </>
            ))}
        </div>
      </div>

      {fetchLoading && <LoadingMessage message="Loading..." />}
      {fetchError && (
        <div className="mt-2">
          <ErrorMessage message="Content Data not found. Either its in your trashbin or is permanently deleted." />
        </div>
      )}

      {/* Set up to avoid rerendering and refetching files */}

      {videoAnnouncement && videoAnnouncementForEdit && (
        <div className={`${isEditMode ? "block" : "hidden"}`}>
          <EditVideoAnnouncement
            videoAnnouncementData={videoAnnouncementForEdit}
            setVideoAnnouncementData={setVideoAnnouncementForEdit}
            newVideos={newVideos}
            setNewVideos={setNewVideos}
            submitFunc={handleSave}
            ref={formRef}
            errors={saveErrors}
            setErrors={setSaveErrors}
            isLoading={deleteLoading || saveLoading}
          />
        </div>
      )}
      {videoAnnouncement &&
        videoAnnouncementForEdit &&
        !deleteLoading &&
        !saveLoading && (
          <div className={`${isEditMode ? "hidden" : "block"}`}>
            <RetrieveVideoAnnouncement
              videoAnnouncementData={videoAnnouncement}
              stopSlider={isEditMode}
            />
          </div>
        )}
    </div>
  );
};
export default VideoContentPage;
