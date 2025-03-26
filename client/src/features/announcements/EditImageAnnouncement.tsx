import { forwardRef } from "react";
import ReactQuill from "react-quill";
import QuillEditor from "../../components/QuillEditor";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";

import { Input, Form, Errortext } from "../../components/ui";
import {
  FullImageAnnouncementType,
  ImageAnnouncementCreateType,
} from "../../types/AnnouncementTypes";
import { convertToDatetimeLocal } from "../../utils/formatters";
import { UpdateImageAnnouncementErrorT } from "./helpers";
import { toast } from "react-toastify";

type EditImageAnnouncementProps = {
  imageAnnouncement: FullImageAnnouncementType;
  setImageAnnouncement: React.Dispatch<
    React.SetStateAction<FullImageAnnouncementType | undefined>
  >;
  newImages: ImageAnnouncementCreateType[];
  setNewImages: React.Dispatch<
    React.SetStateAction<ImageAnnouncementCreateType[]>
  >;
  submitFunc: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  errors: UpdateImageAnnouncementErrorT;
  setErrors: React.Dispatch<
    React.SetStateAction<UpdateImageAnnouncementErrorT>
  >;
};

const EditImageAnnouncement = forwardRef<
  HTMLFormElement,
  EditImageAnnouncementProps
>(
  (
    {
      imageAnnouncement,
      setImageAnnouncement,
      submitFunc,
      newImages,
      setNewImages,
      isLoading,
      errors,
      setErrors,
    }: EditImageAnnouncementProps,
    ref
  ) => {
    const handleTitleEditorChange = (
      __value: any,
      _delta: any,
      _source: any,
      editor: ReactQuill.UnprivilegedEditor
    ) => {
      setImageAnnouncement({
        ...imageAnnouncement,
        title: JSON.stringify(editor.getContents()),
      });
    };

    const handleDurationChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      const updatedImgAnnouncementArr =
        imageAnnouncement.image_announcement.map((item, idx) =>
          idx === index ? { ...item, duration: e.target.value } : { ...item }
        );

      setImageAnnouncement({
        ...imageAnnouncement,
        image_announcement: updatedImgAnnouncementArr,
      });
    };

    const handleDeleteImage = (index: number) => {
      const updatedImgAnnouncementArr = [
        ...imageAnnouncement.image_announcement,
      ];
      updatedImgAnnouncementArr.splice(index, 1);
      setImageAnnouncement({
        ...imageAnnouncement,
        image_announcement: updatedImgAnnouncementArr,
      });

      const newErrorMsg = [...errors.image_announcement];

      newErrorMsg.splice(index, 1);
      setErrors((prev) => ({
        ...prev,
        image_announcement: newErrorMsg,
      }));
    };

    const handleNewUploadOnChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];

      const isDuplicate = newImages.some((existingImage) => {
        if (!(existingImage.image instanceof File)) return false;

        return (
          existingImage.image.name === file.name &&
          existingImage.image.size === file.size
        );
      });

      if (isDuplicate) {
        toast.warn("This image is already uploaded.");
        e.target.value = "";
        return;
      }

      setNewImages((prev) => [...prev, { image: file, duration: "00:00:40" }]);
      e.target.value = "";
    };

    const handleDeleteNewUpload = (index: number) => {
      const newUploadedImages = [...newImages];
      newUploadedImages.splice(index, 1);
      setNewImages(newUploadedImages);

      const newErrorMsg = [...errors.image_announcement];
      newErrorMsg.splice(index, 1);
      setErrors((prev) => ({
        ...prev,
        image_announcement: newErrorMsg,
      }));
    };

    const handleNewImageDurationChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      setNewImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[index].duration = e.target.value;
        return updatedImages;
      });
    };

    return (
      <div className="flex flex-col gap-4">
        <QuillEditor
          label="Announcement Title"
          id="edit-image-announcement-title"
          value={JSON.parse(imageAnnouncement.title as string)}
          onChange={handleTitleEditorChange}
          error={errors.title}
          readonly={isLoading}
          isTitle
        />
        <Form onSubmitFunc={submitFunc} ref={ref}>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              type="datetime-local"
              value={convertToDatetimeLocal(imageAnnouncement.start_date)}
              onChange={(e) =>
                setImageAnnouncement({
                  ...imageAnnouncement,
                  start_date: e.target.value,
                })
              }
              name="start_date"
              labelText="Start date"
              required
              error={errors.start_date}
              disabled={isLoading}
            />
            <Input
              type="datetime-local"
              value={convertToDatetimeLocal(imageAnnouncement.end_date)}
              onChange={(e) =>
                setImageAnnouncement({
                  ...imageAnnouncement,
                  end_date: e.target.value,
                })
              }
              name="end_date"
              labelText="End date"
              required
              error={errors.end_date}
              disabled={isLoading}
            />
          </div>
          <div className="mt-2">
            <h3 className="bg-[#6e8ea4] px-5 py-2 text-xl font-bold">
              Uploaded Images
            </h3>
            <div className="mt-2">
              {imageAnnouncement.image_announcement.length === 0 && (
                <div className="w-full text-center">
                  No image uploaded yet...
                </div>
              )}
              {imageAnnouncement.image_announcement.map((image, index) => {
                const image_file = image.image as string;

                return (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-2 mt-4 bg-white dark:bg-gray-800 border rounded-lg shadow-md p-4"
                  >
                    <img
                      src={image_file}
                      alt={`Uploaded ${index}`}
                      className={`w-[500px] h-[280px] rounded-xl object-contain mx-auto`}
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-bold">
                          {image_file.split("/").pop()}
                        </p>
                        <p className="text-gray-500">
                          {(image.file_size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="min-w-64">
                          <Input
                            labelText="Display Duration"
                            type="text"
                            name={`image_announcement[${index}][duration]`} // This does not matter
                            value={image.duration as string}
                            onChange={(e) => handleDurationChange(e, index)}
                            error={errors.to_update[index]?.duration}
                            disabled={isLoading}
                          />
                        </div>

                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="bg-red-500 hover:bg-red-700 active:bg-red-800 p-2 rounded-lg flex gap-2 items-center text-white"
                          type="button"
                        >
                          <FaTrashAlt className="text-white" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-2">
            <label
              htmlFor="create-image-file-upload"
              className="w-full flex flex-row items-center justify-center gap-2 bg-cyanBlue text-center text-xl font-bold py-2 cursor-pointer"
            >
              <FaPlusCircle className="text-3xl" />
              <span>Add New Images</span>
            </label>
            <input
              type="file"
              id="create-image-file-upload"
              className="hidden invisible"
              onChange={handleNewUploadOnChange}
            />
            {newImages.map((image, index) => {
              const image_file = image.image as File;

              return (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-2 mt-4 bg-white dark:bg-gray-800 border rounded-lg shadow-md p-4"
                >
                  <div>
                    <img
                      src={URL.createObjectURL(image.image as File)}
                      alt={`Uploaded ${index}`}
                      className={`w-[500px] h-[280px] rounded-xl object-contain mx-auto ${
                        errors.image_announcement[index]?.image &&
                        "border border-dashed border-red-600"
                      }`}
                    />
                    {errors.image_announcement[index]?.image && (
                      <Errortext
                        text={errors.image_announcement[index]?.image}
                      />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-bold">{image_file.name}</p>
                      <p className="text-gray-500">
                        {(image_file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="min-w-64">
                        <Input
                          labelText="Display Duration"
                          type="text"
                          name={`image_announcement[${index}][duration]`} // This does not matter
                          value={image.duration as string}
                          onChange={(e) =>
                            handleNewImageDurationChange(e, index)
                          }
                          error={errors.image_announcement[index]?.duration}
                          disabled={isLoading}
                        />
                      </div>

                      <button
                        onClick={() => handleDeleteNewUpload(index)}
                        className="bg-red-500 hover:bg-red-700 active:bg-red-800 p-2 rounded-lg flex gap-2 items-center text-white"
                        type="button"
                      >
                        <FaTrashAlt className="text-white" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Form>
      </div>
    );
  }
);
export default EditImageAnnouncement;
