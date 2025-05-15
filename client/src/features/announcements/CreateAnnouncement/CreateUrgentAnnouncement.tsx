import { useRef, useState } from "react";
import ReactQuill from "react-quill";
import { Delta } from "quill/core";
import { Id, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import QuillEditor, {
  isQuillValueEmpty,
} from "../../../components/QuillEditor";
import { Input } from "../../../components/ui";
import ButtonV2 from "../../../components/ui/ButtonV2";

import useLoadingToast from "../../../hooks/useLoadingToast";
import { useAuth } from "../../../context/AuthProvider";

import {
  urgentAnnouncementErrorState,
  UrgentAnnouncementErrorT,
} from "../helpers";
import { CreateUrgentAnnouncementType } from "../../../types/AnnouncementTypes";

import { createUrgentAnnouncementApi } from "../../../api/announcementRequest";

const CreateUrgentAnnouncement = () => {
  const navigate = useNavigate();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { user, userApi } = useAuth();

  const [title, setTitle] = useState<Delta>(new Delta());
  const titleRef = useRef<ReactQuill>(null);
  const [description, setDescription] = useState<Delta>(new Delta());
  const descriptionRef = useRef<ReactQuill>(null);

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
    setTitle(editor.getContents());
  };

  const handleDescriptionEditorChange = (
    __value: any,
    _delta: any,
    _source: any,
    editor: ReactQuill.UnprivilegedEditor
  ) => {
    setDescription(editor.getContents());
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(urgentAnnouncementErrorState);

    // Error handling
    if (isQuillValueEmpty(title) && titleRef.current?.editor) {
      titleRef.current.editor.focus();
      setError((prev) => ({
        ...prev,
        title: "Title cannot be empty.",
      }));
      toast.warning("Title cannot be empty.");
      return;
    }

    if (isQuillValueEmpty(description) && descriptionRef.current?.editor) {
      descriptionRef.current.editor.focus();
      setError((prev) => ({
        ...prev,
        description: "Description cannot be empty",
      }));
      toast.warning("Description cannot be empty.");
      return;
    }

    if (
      !user?.is_admin &&
      !confirm("Are you sure you want to submit this announcement?")
    ) {
      return;
    }

    loading("Submitting urgent announcement. Please wait.");
    setIsSaving(true);

    const fd = new FormData(e.currentTarget);
    const obj_data = Object.fromEntries(fd.entries());

    const data: CreateUrgentAnnouncementType = {
      title: title,
      description: description,
      duration: obj_data["duration"] as string,
    };

    try {
      const res_data = await createUrgentAnnouncementApi(userApi, data);
      update({
        render: "Urgent announcement created successfully.",
        type: "success",
      });
      const form = e.target as HTMLFormElement;
      setTitle(new Delta());
      setDescription(new Delta());
      form.reset();
      const redirect_conf = confirm(
        "New Urgent Announcement created. Do you want to be redirected to the Annoucement?"
      );

      if (redirect_conf) {
        navigate(`/dashboard/contents/urgent/${res_data.id}`);
      }
    } catch (error) {
      update({ render: "Failed to submit. Please try again", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <QuillEditor
        id="text-title"
        label="Title"
        value={title}
        onChange={handleTitleEditorChange}
        readonly={isSaving}
        ref={titleRef}
        error={error.title}
        placeholder="Create a title for your announcement"
      />
      <QuillEditor
        id="text-description"
        label="Description"
        value={description}
        onChange={handleDescriptionEditorChange}
        className="custom-quill"
        ref={descriptionRef}
        readonly={isSaving}
        error={error.description}
        placeholder="Announcement Description..."
      />
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
        <Input
          type="number"
          name="duration"
          labelText="Duration in seconds"
          placeholder="Set empty for default (40 sec)"
          helpText={["Duration for which announcement will be displayed."]}
          disabled={isSaving}
          error={error.duration}
          defaultValue={40}
        />
      </div>
      <div className="w-full mt-2 flex justify-end">
        <ButtonV2
          type="submit"
          text={isSaving ? "Saving..." : "Save"}
          disabled={isSaving}
        />
      </div>
    </form>
  );
};
export default CreateUrgentAnnouncement;
