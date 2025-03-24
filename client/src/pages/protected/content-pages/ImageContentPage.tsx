import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import axios from "axios";
import { Id, toast } from "react-toastify";

import { isQuillValueEmpty } from "../../../components/QuillEditor";
import {
  isObjectEqual,
  getRemovedId,
  filterListObjectKeys,
} from "../../../utils/utils";
import {
  retrieveImageAnnouncementApi,
  deleteImageAnnouncementApi,
  updateImageAnnouncementApi,
} from "../../../api/announcementRequest";
import { useAuth } from "../../../context/AuthProvider";
import {
  RetrieveImageAnnouncement,
  EditImageAnnouncement,
} from "../../../features/announcements";
import {
  FullImageAnnouncementType,
  ImageAnnouncementCreateType,
} from "../../../types/AnnouncementTypes";
import { UpdateImageAnnouncementErrorState } from "../../../features/announcements/helpers";
import useLoadingToast from "../../../hooks/useLoadingToast";

// TODO: Switching re fetches images

const ImageContentPage = () => {
  /**
   * Only supports Duration Edits. For changes, see handleSave
   */

  // #region: Initialization
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { id } = useParams();
  const { userApi } = useAuth();
  const formRef = useRef<HTMLFormElement | null>(null);
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [imageAnnouncement, setImageAnnouncement] = useState<
    FullImageAnnouncementType | undefined
  >(undefined);
  const [imageAnnouncementForEdit, setImageAnnouncementForEdit] = useState<
    FullImageAnnouncementType | undefined
  >(undefined);
  const [newImages, setNewImages] = useState<ImageAnnouncementCreateType[]>([]);

  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveErrors, setSaveErrors] = useState(
    UpdateImageAnnouncementErrorState
  );

  // #endregion

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res_data = await retrieveImageAnnouncementApi(
          userApi,
          id as string
        );
        setImageAnnouncement(res_data);
        setImageAnnouncementForEdit(res_data);
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
    fetchData();
  }, []);

  const handleCancel = () => {
    if (!isObjectEqual(imageAnnouncement, imageAnnouncementForEdit)) {
      const cancelConf = confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost"
      );

      if (!cancelConf) return;
    }

    setImageAnnouncementForEdit(imageAnnouncement);
    setIsEditMode(false);
    setSaveErrors(UpdateImageAnnouncementErrorState);
  };

  const handleDelete = async () => {
    const delete_conf = confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!delete_conf || !imageAnnouncement) return;
    loading("Deleting. Please wait...");
    try {
      setDeleteLoading(true);
      await deleteImageAnnouncementApi(userApi, imageAnnouncement?.id);
      update({ render: "Delete successful", type: "success" });
      navigate("/dashboard/contents/image");
    } catch (error) {
      update({
        render: "Delete unsuccessful. Please try again.",
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const obj_data = Object.fromEntries(fd.entries());

    // Error handling
    if (
      isQuillValueEmpty(JSON.parse(imageAnnouncementForEdit?.title as string))
    ) {
      toast.warn("Title cannot be empty.");
      return;
    }

    if (imageAnnouncementForEdit?.image_announcement.length === 0) {
      toast.warn("Images cannot be empty.");
      return;
    }

    const updated_announcement = {
      title: imageAnnouncementForEdit?.title,
      start_date: obj_data.start_date,
      end_date: obj_data.end_date,
      to_delete: JSON.stringify(
        getRemovedId(
          imageAnnouncement?.image_announcement,
          imageAnnouncementForEdit?.image_announcement
        )
      ),
      to_update: filterListObjectKeys(
        imageAnnouncementForEdit?.image_announcement,
        ["id", "duration"]
      ),
      image_announcement: newImages,
    };

    loading("Saving updates. Please wait...");

    try {
      setSaveLoading(true);
      const res_data = await updateImageAnnouncementApi(
        userApi,
        imageAnnouncement?.id as string,
        updated_announcement
      );
      setImageAnnouncement(res_data);
      setImageAnnouncementForEdit(res_data);
      setIsEditMode(false);
      setSaveErrors(UpdateImageAnnouncementErrorState);
      update({ render: "Update successful", type: "success" });
      setNewImages([]);
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

  if (imageAnnouncement?.image_announcement.length === 0) {
    return (
      <div className="mt-2 flex flex-col items-center justify-center">
        <p>Data does not resemble as Image Content</p>
        <Link to="/dashboard/contents/image">
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
      <div className="w-full flex flex-row items-center justify-between">
        <Link to="/dashboard/contents/image">
          <button
            className={`flex flex-row items-center gap-2 px-8 py-1 rounded-full border border-black bg-lightBlue hover:bg-lightBlue-300 active:bg-lightBlue-500 ${
              deleteLoading || (saveLoading && "cursor-not-allowed")
            }`}
          >
            <FaArrowLeft />
            Back
          </button>
        </Link>
        <div className="flex flex-row items-center gap-4">
          {isEditMode ? (
            <>
              <button
                className={`flex flex-row items-center gap-2 px-6 py-1 rounded-full border border-black bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 ${
                  deleteLoading || (saveLoading && "cursor-not-allowed")
                }`}
                onClick={handleSaveButton}
                disabled={deleteLoading || saveLoading}
              >
                <FaSave />
                {saveLoading ? "Saving..." : "Save"}
              </button>
              <button
                className={`flex flex-row items-center gap-2 px-6 py-1 rounded-full border border-black bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700 ${
                  deleteLoading || (saveLoading && "cursor-not-allowed")
                }`}
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
                className={`flex flex-row items-center gap-2 px-6 py-1 rounded-full border border-black bg-green-500 text-white hover:bg-green-600 active:bg-green-700 ${
                  deleteLoading || (saveLoading && "cursor-not-allowed")
                }`}
                onClick={() => setIsEditMode(true)}
                disabled={deleteLoading || saveLoading}
              >
                <FaEdit />
                Edit
              </button>
              <button
                className={`flex flex-row items-center gap-2 px-6 py-1 rounded-full border border-black bg-red-500 text-white hover:bg-red-600 active:bg-red-700 ${
                  deleteLoading || (saveLoading && "cursor-not-allowed")
                }`}
                onClick={handleDelete}
                disabled={deleteLoading || saveLoading}
              >
                <FaTrashAlt />
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>

      {fetchLoading && <div>Fetching content...</div>}
      {fetchError && <div>{fetchError}</div>}
      {imageAnnouncement &&
        imageAnnouncementForEdit &&
        (isEditMode ? (
          <EditImageAnnouncement
            imageAnnouncement={imageAnnouncementForEdit}
            setImageAnnouncement={setImageAnnouncementForEdit}
            newImages={newImages}
            setNewImages={setNewImages}
            submitFunc={handleSave}
            ref={formRef}
            isLoading={deleteLoading || saveLoading}
            errors={saveErrors}
            setErrors={setSaveErrors}
          />
        ) : (
          <RetrieveImageAnnouncement imageAnnouncement={imageAnnouncement} />
        ))}
    </div>
  );
};
export default ImageContentPage;
