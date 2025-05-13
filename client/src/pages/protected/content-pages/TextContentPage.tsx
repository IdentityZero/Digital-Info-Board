import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaTrashAlt,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import { Id, toast } from "react-toastify";

import { isObjectEqual } from "../../../utils/utils";
import {
  retrieveTextAnnouncementApi,
  deleteTextAnnouncementApi,
  updateTextAnnouncementApi,
} from "../../../api/announcementRequest";
import { useAuth } from "../../../context/AuthProvider";
import { type FullTextAnnouncementType } from "../../../types/AnnouncementTypes";
import {
  RetrieveTextAnnouncement,
  EditTextAnnouncement,
} from "../../../features/announcements";
import {
  textAnnouncementErrorState,
  type TextAnnouncementErrorT,
} from "../../../features/announcements/helpers";
import { isQuillValueEmpty } from "../../../components/QuillEditor";

import useLoadingToast from "../../../hooks/useLoadingToast";
import ErrorMessage from "../../../components/ErrorMessage";

const TextContentPage = () => {
  const toastId = useRef<Id | null>(null);
  const { loading: toastLoading, update } = useLoadingToast(toastId);
  const { id } = useParams();
  const { userApi } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [isEditMode, setIsEditMode] = useState(false);

  const [data, setData] = useState<FullTextAnnouncementType | undefined>(
    undefined
  );
  const [dataForEdit, setDataForEdit] = useState<
    FullTextAnnouncementType | undefined
  >(undefined);

  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [savingError, setSavingError] = useState<TextAnnouncementErrorT>(
    textAnnouncementErrorState
  );
  const [savingLoading, setSavingLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res_data = await retrieveTextAnnouncementApi(userApi, id);

        setData(res_data);
        setDataForEdit(res_data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 404) {
            setError("No data found...");
            return;
          }
        }
        setError("Unexpected error occured. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async () => {
    const delete_conf = confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!delete_conf) return;
    if (!data) return;

    toastLoading("Deleting. Please wait...");

    try {
      setDeleteLoading(true);
      await deleteTextAnnouncementApi(userApi, data?.id);
      setData(undefined);
      update({ render: "Delete successful", type: "success" });

      navigate("/dashboard/contents/text");
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
    if (!isObjectEqual(data, dataForEdit)) {
      const cancelConf = confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost"
      );

      if (!cancelConf) return;
    }

    setDataForEdit(data);
    setIsEditMode(false);
    setSavingError(textAnnouncementErrorState);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const obj_data = Object.fromEntries(fd.entries());
    let emptyErrors = false;

    if (!data) return;

    // Handle empty values
    if (isQuillValueEmpty(JSON.parse(dataForEdit?.title as string))) {
      emptyErrors = true;
      setSavingError((prev) => ({
        ...prev,
        title: "Title cannot be empty",
      }));
      toast.warn("Title cannot be empty.");
    }
    if (
      isQuillValueEmpty(
        JSON.parse(dataForEdit?.text_announcement.details as string)
      )
    ) {
      emptyErrors = true;
      setSavingError((prev) => ({
        ...prev,
        text_announcement: {
          ...prev.text_announcement,
          details: "Details cannot be empty",
        },
      }));
      toast.warn("Details cannot be empty.");
    }

    if (emptyErrors) return;

    const updated_data = {
      title: dataForEdit?.title,
      start_date: obj_data.start_date,
      end_date: obj_data.end_date,
      text_announcement: {
        details: dataForEdit?.text_announcement.details,
        duration: dataForEdit?.text_announcement.duration,
      },
    };

    toastLoading("Saving updates. Please wait...");

    try {
      setSavingError(textAnnouncementErrorState);
      setSavingLoading(true);
      const res_data = await updateTextAnnouncementApi(
        userApi,
        data.id,
        updated_data
      );
      setData(res_data);
      setDataForEdit(res_data);
      update({ render: "Update successful", type: "success" });
      setIsEditMode(false);
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
        setSavingError((prev) => ({
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
      setSavingLoading(false);
    }
  };

  const handleSaveButton = () => {
    if (!formRef.current) return;
    formRef.current.requestSubmit();
  };

  if (!data?.text_announcement) {
    return (
      <div className="mt-2 flex flex-col items-center justify-center gap-2">
        <ErrorMessage message="Error could be because data does not resemble as News Content or in trashbin or is permanently deleted" />
        <Link to="/dashboard/contents/text">
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
        <Link to="/dashboard/contents/text">
          <button className="flex flex-row items-center gap-2 px-8 py-1 rounded-full border border-black bg-lightBlue hover:bg-lightBlue-300 active:bg-lightBlue-500">
            <FaArrowLeft />
            Back
          </button>
        </Link>
        <div className="flex flex-row items-center gap-4">
          {isEditMode ? (
            <>
              <button
                className="flex flex-row items-center gap-2 px-6 py-1 rounded-full border border-black bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
                onClick={handleSaveButton}
                disabled={savingLoading}
              >
                <FaSave />
                {savingLoading ? "Saving..." : "Save"}
              </button>
              <button
                className="flex flex-row items-center gap-2 px-6 py-1 rounded-full border border-black bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700"
                onClick={handleCancel}
                disabled={savingLoading}
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
              >
                <FaEdit />
                Edit
              </button>
              <button
                className="flex flex-row items-center gap-2 px-6 py-1 rounded-full border border-black bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                <FaTrashAlt />
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {data &&
        dataForEdit &&
        (isEditMode ? (
          <EditTextAnnouncement
            data={dataForEdit}
            setData={setDataForEdit}
            submitFunc={handleSave}
            ref={formRef}
            errors={savingError}
            isLoading={savingLoading}
          />
        ) : (
          <RetrieveTextAnnouncement data={data} />
        ))}
    </div>
  );
};
export default TextContentPage;
