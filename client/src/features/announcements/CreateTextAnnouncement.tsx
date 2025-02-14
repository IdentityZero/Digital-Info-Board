import { useRef, useState } from "react";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import { Delta } from "quill/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthProvider";
import QuillEditor, { isQuillValueEmpty } from "../../components/QuillEditor";
import { Form, Input } from "../../components/ui";
import { type CreateTextAnnouncementT } from "../../types/AnnouncementTypes";
import { createNewAllTypeAnnouncementApi } from "../../api/announcementRequest";

import {
  textAnnouncementErrorState,
  type TextAnnouncementErrorT,
} from "./helpers";

const CreateTextAnnouncement = () => {
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

    try {
      setLoading(true);
      const res_data = await createNewAllTypeAnnouncementApi(userApi, data);
      // Success message
      const form = e.target as HTMLFormElement;
      setTitle(new Delta());
      setDetails(new Delta());
      form.reset();
      toast.success("Text Content Created.");
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
          toast.error("Unexpected error occured. Please try again.");
          return;
        }
        setError((prev) => ({
          ...prev,
          ...err,
        }));
        toast.warning("Please check errors before submitting.");
      } else {
        toast.error("Unexpected error occured. Please try again.");
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
        <div className="mt-2 flex flex-wrap gap-2">
          <div className="basis-[calc(50%-0.5rem)]">
            <Input
              type="datetime-local"
              ctrl_type="uncontrolled"
              name="start_date"
              label="Start date"
              required
              disabled={loading}
              error={error.start_date}
            />
          </div>
          <div className="basis-[calc(50%-0.5rem)]">
            <Input
              type="datetime-local"
              ctrl_type="uncontrolled"
              name="end_date"
              label="End date"
              required
              disabled={loading}
              error={error.end_date}
            />
          </div>
          <div className="basis-[calc(50%-0.5rem)]">
            <Input
              type="number"
              ctrl_type="uncontrolled"
              name="duration"
              label="Duration in seconds"
              placeholder="Set empty for default (40 sec)"
              helpText={[
                "Duration for which announcement will be displayed.",
                "Set empty for default (40 sec)",
              ]}
              disabled={loading}
              error={error.text_announcement.duration}
            />
          </div>
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
