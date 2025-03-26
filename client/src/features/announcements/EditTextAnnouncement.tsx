import { forwardRef } from "react";
import ReactQuill from "react-quill";
import { FullTextAnnouncementType } from "../../types/AnnouncementTypes";
import QuillEditor from "../../components/QuillEditor";
import { Input, Form } from "../../components/ui";
import { convertToDatetimeLocal } from "../../utils/formatters";

import { TextAnnouncementErrorT } from "./helpers";

interface EditTextAnnouncementProps {
  data: FullTextAnnouncementType;
  setData: React.Dispatch<
    React.SetStateAction<FullTextAnnouncementType | undefined>
  >;
  submitFunc: (e: React.FormEvent<HTMLFormElement>) => void;
  errors: TextAnnouncementErrorT;
  isLoading: boolean;
}

const EditTextAnnouncement = forwardRef<
  HTMLFormElement,
  EditTextAnnouncementProps
>(
  (
    { data, setData, submitFunc, errors, isLoading }: EditTextAnnouncementProps,
    ref
  ) => {
    const handleTitleEditorChange = (
      __value: any,
      _delta: any,
      _source: any,
      editor: ReactQuill.UnprivilegedEditor
    ) => {
      setData({ ...data, title: JSON.stringify(editor.getContents()) });
    };

    const handleDetailsEditorChange = (
      __value: any,
      _delta: any,
      _source: any,
      editor: ReactQuill.UnprivilegedEditor
    ) => {
      setData({
        ...data,
        text_announcement: {
          ...data.text_announcement,
          details: JSON.stringify(editor.getContents()),
        },
      });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputName: "start_date" | "end_date" | "duration" = e.target
        .name as "start_date" | "end_date" | "duration";
      if (inputName === "start_date" || inputName === "end_date") {
        setData({ ...data, [inputName]: e.target.value });
      }

      if (inputName === "duration") {
        setData({
          ...data,
          text_announcement: {
            ...data.text_announcement,
            duration: e.target.value,
          },
        });
      }
    };

    return (
      <div className="flex flex-col gap-2">
        <QuillEditor
          label="Announcement Title"
          id="edit-text-announcement-title"
          value={JSON.parse(data.title as string)}
          onChange={handleTitleEditorChange}
          error={errors.title}
          readonly={isLoading}
          isTitle
        />
        <QuillEditor
          label="Details"
          id="edit-text-announcement-details"
          value={JSON.parse(data.text_announcement.details as string)}
          onChange={handleDetailsEditorChange}
          error={errors.text_announcement.details}
          readonly={isLoading}
        />
        <Form ref={ref} onSubmitFunc={submitFunc}>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              type="datetime-local"
              value={convertToDatetimeLocal(data.start_date)}
              onChange={handleInputChange}
              name="start_date"
              labelText="Start date"
              required
              error={errors.start_date}
              disabled={isLoading}
            />
            <Input
              type="datetime-local"
              value={convertToDatetimeLocal(data.end_date)}
              onChange={handleInputChange}
              name="end_date"
              labelText="End date"
              required
              error={errors.end_date}
              disabled={isLoading}
            />
            <div className="basis-[calc(50%-0.5rem)]">
              <Input
                type="string"
                name="duration"
                labelText="Duration in seconds"
                helpText={[
                  "Follow HH:MM:SS format",
                  "Duration for which announcement will be displayed.",
                ]}
                required
                value={data.text_announcement.duration as string}
                onChange={handleInputChange}
                error={errors.text_announcement.duration}
                disabled={isLoading}
              />
            </div>
          </div>
        </Form>
      </div>
    );
  }
);
export default EditTextAnnouncement;
