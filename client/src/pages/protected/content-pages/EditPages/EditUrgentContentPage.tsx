import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaSave, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CreateUrgentAnnouncementType,
  UrgentAnnouncementType,
} from "../../../../types/AnnouncementTypes";
import {
  retrieveUrgentAnnouncementApi,
  updateUrgentAnnouncementApi,
} from "../../../../api/announcementRequest";
import { useAuth } from "../../../../context/AuthProvider";
import LoadingOrErrorWrapper from "../../../../components/LoadingOrErrorWrapper";
import QuillEditor, {
  isQuillValueEmpty,
} from "../../../../components/QuillEditor";
import ReactQuill from "react-quill";
import { Input } from "../../../../components/ui";
import {
  urgentAnnouncementErrorState,
  UrgentAnnouncementErrorT,
} from "../../../../features/announcements/helpers";
import { Delta } from "quill/core";
import { Id, toast } from "react-toastify";
import useLoadingToast from "../../../../hooks/useLoadingToast";

const EditUrgentContentPage = () => {
  const navigate = useNavigate();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();
  const { id } = useParams();
  const titleRef = useRef<ReactQuill>(null);
  const descriptionRef = useRef<ReactQuill>(null);

  const [announcement, setAnnouncement] = useState<UrgentAnnouncementType>();
  const [isFetching, setIsFetching] = useState(true);
  const [hasFetchingError, setHasFetchingError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<UrgentAnnouncementErrorT>(
    urgentAnnouncementErrorState
  );

  const handleTitleEditorChange = (
    __value: any,
    _delta: any,
    _source: any,
    editor: ReactQuill.UnprivilegedEditor
  ) => {
    setAnnouncement((prev) => {
      if (!prev) return;
      return { ...prev, title: editor.getContents() };
    });
  };

  const handleDescriptionEditorChange = (
    __value: any,
    _delta: any,
    _source: any,
    editor: ReactQuill.UnprivilegedEditor
  ) => {
    setAnnouncement((prev) => {
      if (!prev) return;
      return { ...prev, description: editor.getContents() };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!announcement) return;

    setError(urgentAnnouncementErrorState);

    if (
      isQuillValueEmpty(announcement?.title as Delta) &&
      titleRef.current?.editor
    ) {
      titleRef.current.editor.focus();
      setError((prev) => ({
        ...prev,
        title: "Title cannot be empty.",
      }));
      toast.warning("Title cannot be empty.");
      return;
    }

    if (
      isQuillValueEmpty(announcement?.description as Delta) &&
      descriptionRef.current?.editor
    ) {
      descriptionRef.current.editor.focus();
      setError((prev) => ({
        ...prev,
        description: "Description cannot be empty",
      }));
      toast.warning("Description cannot be empty.");
      return;
    }

    const data: CreateUrgentAnnouncementType = {
      title: announcement?.title,
      description: announcement.description,
      duration: announcement.duration,
    };

    loading("Updating content. Please wait...");
    setIsSaving(true);
    try {
      await updateUrgentAnnouncementApi(userApi, id as string, data);
      update({
        render: "Urgent announcement updated successfully..",
        type: "success",
      });
      navigate("/dashboard/contents/urgent/" + id);
    } catch (error) {
      update({
        render: "Failed to submit. Make sure your inputs are valid. Try again",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setIsFetching(true);
        const res_data = await retrieveUrgentAnnouncementApi(
          userApi,
          id as string
        );
        setAnnouncement(res_data);
      } catch (error) {
        setHasFetchingError(true);
      } finally {
        setIsFetching(false);
      }
    };
    fetchAnnouncement();
  }, []);

  return (
    <form className="p-4" onSubmit={handleSubmit}>
      <div className="mb-2 flex flex-col md:flex-row md:justify-between gap-2">
        {/* Back Button */}
        <div className="w-full md:w-auto">
          <Link to="/dashboard/contents/urgent">
            <button
              className={`w-full md:w-auto flex flex-row items-center justify-center gap-2 px-8 py-1 rounded-full border border-black bg-lightBlue hover:bg-lightBlue-300 active:bg-lightBlue-500`}
            >
              <FaArrowLeft />
              Back to list
            </button>
          </Link>
        </div>

        {/* Save & Cancel Buttons */}
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <button
            className={`w-full md:w-auto flex flex-row items-center justify-center gap-2 px-6 py-1 rounded-full border border-black bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 ${
              isSaving ? "cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isSaving}
          >
            <FaSave />
            {isSaving ? "Saving..." : "Save"}
          </button>

          <Link to={`/dashboard/contents/urgent/${id}`}>
            <button
              className={`w-full md:w-auto flex flex-row items-center justify-center gap-2 px-6 py-1 rounded-full border border-black bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700 ${
                isSaving ? "cursor-not-allowed" : ""
              }`}
              disabled={isSaving}
            >
              <FaTimes />
              Cancel
            </button>
          </Link>
        </div>
      </div>

      <LoadingOrErrorWrapper isLoading={isFetching} hasError={hasFetchingError}>
        <QuillEditor
          id="text-title"
          label="Title"
          value={announcement?.title}
          onChange={handleTitleEditorChange}
          readonly={isSaving}
          ref={titleRef}
          error={error.title}
        />
        <QuillEditor
          id="text-description"
          label="Description"
          value={announcement?.description}
          onChange={handleDescriptionEditorChange}
          className="custom-quill"
          ref={descriptionRef}
          readonly={isSaving}
          error={error.description}
        />
      </LoadingOrErrorWrapper>
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
        <Input
          required
          name="duration"
          labelText="Duration"
          helpText={["Duration for which announcement will be displayed."]}
          disabled={isSaving}
          error={error.duration}
          value={announcement?.duration}
          onChange={(e) =>
            setAnnouncement((prev) => {
              if (!prev) return;
              return { ...prev, duration: e.target.value };
            })
          }
        />
      </div>
    </form>
  );
};
export default EditUrgentContentPage;
