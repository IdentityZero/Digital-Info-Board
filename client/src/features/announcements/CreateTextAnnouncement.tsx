import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Id, toast } from "react-toastify";
import ReactQuill from "react-quill";
import { Delta } from "quill/core";
import axios from "axios";

import QuillEditor, { isQuillValueEmpty } from "../../components/QuillEditor";
import { Form, Input } from "../../components/ui";

import { useAuth } from "../../context/AuthProvider";

import { type CreateTextAnnouncementT } from "../../types/AnnouncementTypes";
import { createNewAllTypeAnnouncementApi } from "../../api/announcementRequest";
import {
  textAnnouncementErrorState,
  type TextAnnouncementErrorT,
} from "./helpers";
import useLoadingToast from "../../hooks/useLoadingToast";

const CreateTextAnnouncement = () => {
  const toastId = useRef<Id | null>(null);
  const { loading: loadingToast, update } = useLoadingToast(toastId);

  const [title, setTitle] = useState<Delta>(new Delta());
  const titleRef = useRef<ReactQuill>(null);
  const [details, setDetails] = useState<Delta>(new Delta());
  const detailsRef = useRef<ReactQuill>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TextAnnouncementErrorT>(
    textAnnouncementErrorState
  );
  const navigate = useNavigate();

  const { userApi } = useAuth();

  const handleTitleEditorChange = (
    __value: any,
    _delta: any,
    _source: any,
    editor: ReactQuill.UnprivilegedEditor
  ) => {
    setTitle(editor.getContents());
  };

  const handleDetailsEditorChange = (
    __value: any,
    _delta: any,
    _source: any,
    editor: ReactQuill.UnprivilegedEditor
  ) => {
    setDetails(editor.getContents());
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const obj_data = Object.fromEntries(fd.entries());

    // Reset Errors
    setError(textAnnouncementErrorState);

    if (isQuillValueEmpty(title) && titleRef.current?.editor) {
      titleRef.current.editor.focus();
      setError((prev) => ({
        ...prev,
        title: "Title cannot be empty.",
      }));
      toast.warning("Title cannot be empty.");
      return;
    }

    if (isQuillValueEmpty(details) && detailsRef.current?.editor) {
      detailsRef.current.editor.focus();
      setError((prev) => ({
        ...prev,
        text_announcement: {
          ...prev.text_announcement,
          details: "Details cannot be empty",
        },
      }));
      toast.warning("Details cannot be empty.");
      return;
    }

    const data: CreateTextAnnouncementT = {
      title: JSON.stringify(title),
      start_date: String(obj_data["start_date"]),
      end_date: String(obj_data["end_date"]),
      text_announcement: {
        details: JSON.stringify(details),
        duration:
          String(obj_data["duration"]) === ""
            ? null
            : String(obj_data["duration"]),
      },
    };

    loadingToast("Saving content...");

    try {
      setLoading(true);
      const res_data = await createNewAllTypeAnnouncementApi(userApi, data);
      // Success message
      const form = e.target as HTMLFormElement;
      setTitle(new Delta());
      setDetails(new Delta());
      form.reset();
      update({ render: "Text Content Created", type: "success" });
      const redirect_conf = confirm(
        "New Text Announcement created. Do you want to be redirected to the Annoucement?"
      );

      if (redirect_conf) {
        navigate(`/dashboard/contents/text/${res_data.id}`);
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
    }
  };

  return (
    <div>
      <Form onSubmitFunc={handleFormSubmit}>
        <QuillEditor
          id="text-title"
          label="Announcement Title"
          value={title}
          onChange={handleTitleEditorChange}
          readonly={loading}
          ref={titleRef}
          error={error.title}
          placeholder="Create a title for your announcement"
          isTitle
        />
        <br />
        <QuillEditor
          id="text-details"
          label="Details"
          value={details}
          onChange={handleDetailsEditorChange}
          className="custom-quill"
          ref={detailsRef}
          readonly={loading}
          error={error.text_announcement.details}
          placeholder="Announcement Details..."
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
          <Input
            type="number"
            name="duration"
            labelText="Duration in seconds"
            placeholder="Set empty for default (40 sec)"
            helpText={[
              "Duration for which announcement will be displayed.",
              "Set empty for default (40 sec)",
            ]}
            disabled={loading}
            error={error.text_announcement.duration}
          />
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
export default CreateTextAnnouncement;
