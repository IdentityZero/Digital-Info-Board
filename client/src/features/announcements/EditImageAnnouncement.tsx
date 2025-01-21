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
        alert("This image is already uploaded");
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
          <div className="flex flex-wrap gap-2">
            <div className="basis-[calc(50%-0.5rem)]">
              <Input
                type="datetime-local"
                ctrl_type="controlled"
                inputValue={convertToDatetimeLocal(
                  imageAnnouncement.start_date
                )}
                setInputValue={(e) =>
                  setImageAnnouncement({
                    ...imageAnnouncement,
                    start_date: e.target.value,
                  })
                }
                name="start_date"
                label="Start date"
                required
                error={errors.start_date}
                disabled={isLoading}
              />
            </div>
            <div className="basis-[calc(50%-0.5rem)]">
              <Input
                type="datetime-local"
                ctrl_type="controlled"
                inputValue={convertToDatetimeLocal(imageAnnouncement.end_date)}
                setInputValue={(e) =>
                  setImageAnnouncement({
                    ...imageAnnouncement,
                    end_date: e.target.value,
                  })
                }
                name="end_date"
                label="End date"
                required
                error={errors.end_date}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="bg-[#6e8ea4] px-5 py-2 text-xl font-bold">
              Uploaded Images
            </h3>
            <div className="mt-2">
              <div className="flex items-center justify-between gap-2 py-3 mb-2 border-t-2 border-b-2 border-gray-500">
                <span className="font-semibold flex-1 w-[150px] text-center">
                  Image
                </span>
                <span className="font-semibold flex-1 text-center">
                  Image name
                </span>
                <span className="font-semibold flex-1 text-center">
                  Duration (HH:MM:SS)
                </span>
                <span className="font-semibold flex-1 text-center">Size</span>
                <span className="font-semibold flex-1 text-center">Delete</span>
              </div>

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
                    className="flex items-center justify-between gap-2 py-3 mb-2 border-t-2 border-b-2 border-gray-500"
                  >
                    <span className="flex-1">
                      <img
                        src={image_file}
                        alt={`Uploaded ${index}`}
                        className={`w-[150px] h-auto m-[10px]`}
                      />
                    </span>
                    <span className=" flex-1 text-center">
                      {image_file.split("/").pop()}
                    </span>
                    <span className="flex-1 text-center">
                      <Input
                        ctrl_type="controlled"
                        label=""
                        type="text"
                        name={`image_announcement[${index}][duration]`} // This does not matter
                        inputValue={image.duration as string}
                        setInputValue={(e) => handleDurationChange(e, index)}
                        error={errors.to_update[index]?.duration}
                        disabled={isLoading}
                      />
                    </span>
                    <span className="flex-1 text-center">
                      {(image.file_size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <span className="flex-1 text-center">
                      <button
                        onClick={() => handleDeleteImage(index)}
                        className="bg-red-500 hover:bg-red-700 p-2 rounded-full"
                        type="button"
                      >
                        <FaTrashAlt className="text-white" />
                      </button>
                    </span>
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
                  className="flex items-center justify-between gap-2 py-3 mb-2 border-t-2 border-b-2 border-gray-500"
                >
                  <span className="flex-1">
                    <img
                      src={URL.createObjectURL(image.image as File)}
                      alt={`Uploaded ${index}`}
                      className={`w-[150px] h-auto m-[10px] ${
                        errors.image_announcement[index]?.image &&
                        "border border-dashed border-red-600"
                      }`}
                    />
                    {errors.image_announcement[index]?.image && (
                      <Errortext
                        text={errors.image_announcement[index]?.image}
                      />
                    )}
                  </span>
                  <span className=" flex-1 text-center">{image_file.name}</span>
                  <span className="flex-1 text-center">
                    <Input
                      ctrl_type="controlled"
                      label=""
                      type="text"
                      name={`image_announcement[${index}][duration]`} // This does not matter
                      inputValue={image.duration as string}
                      setInputValue={(e) =>
                        handleNewImageDurationChange(e, index)
                      }
                      error={errors.image_announcement[index]?.duration}
                      disabled={isLoading}
                    />
                  </span>
                  <span className="flex-1 text-center">
                    {(image_file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                  <span className="flex-1 text-center">
                    <button
                      onClick={() => handleDeleteNewUpload(index)}
                      className="bg-red-500 hover:bg-red-700 p-2 rounded-full"
                      type="button"
                    >
                      <FaTrashAlt className="text-white" />
                    </button>
                  </span>
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
