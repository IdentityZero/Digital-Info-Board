import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Id, toast } from "react-toastify";
import ReactQuill from "react-quill";
import { Delta } from "quill/core";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";

import QuillEditor, {
  isQuillValueEmpty,
} from "../../../components/QuillEditor";
import { Input, Form, Errortext } from "../../../components/ui";

import { useAuth } from "../../../context/AuthProvider";
import useLoadingToast from "../../../hooks/useLoadingToast";

import {
  type ImageAnnouncementCreateType,
  type CreateImageAnnouncementT,
} from "../../../types/AnnouncementTypes";
import { createNewAllTypeAnnouncementApi } from "../../../api/announcementRequest";
import { CreateImageAnnouncementErrorState } from "../helpers";
import { MAX_IMAGE_SIZE } from "../../../constants/api";

const CreateImageAnnouncement = () => {
  const toastId = useRef<Id | null>(null);
  const { loading: loadingToast, update } = useLoadingToast(toastId);

  const { userApi } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState<Delta>(new Delta());
  const titleRef = useRef<ReactQuill>(null);
  const [images, setImages] = useState<ImageAnnouncementCreateType[]>([]);

  const [error, setError] = useState(CreateImageAnnouncementErrorState);
  const [loading, setLoading] = useState(false);

  const handleTitleEditorChange = (
    __value: any,
    _delta: any,
    _source: any,
    editor: ReactQuill.UnprivilegedEditor
  ) => {
    setTitle(editor.getContents());
  };

  const handleUploadOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];

    const isDuplicate = images.some((existingImage) => {
      if (!(existingImage.image instanceof File)) return false;

      return (
        existingImage.image.name === file.name &&
        existingImage.image.size === file.size
      );
    });

    if (isDuplicate) {
      toast.warning("This image is already uploaded");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.warning("File size exceeds 10MB. Upload aborted.");
      e.target.value = "";
      return;
    }

    setImages((prev) => [...prev, { image: file, duration: "00:00:40" }]);
    e.target.value = "";
  };

  const handleDeleteUpload = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newErrorMsg = [...error.image_announcement];
    newErrorMsg.splice(index, 1);
    setError((prev) => ({
      ...prev,
      image_announcement: newErrorMsg,
    }));
  };

  const handleDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index].duration = e.target.value;
      return updatedImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isQuillValueEmpty(title) && titleRef.current?.editor) {
      titleRef.current.editor.focus();
      setError((prev) => ({
        ...prev,
        title: "Title cannot be empty.",
      }));
      toast.warning("Title cannot be empty.");
      return;
    }

    if (images.length === 0) {
      toast.warning("Content cannot be empty.");
      return;
    }

    const fd = new FormData(e.currentTarget);

    const obj_data = Object.fromEntries(fd.entries());

    const newImageAnnData: CreateImageAnnouncementT = {
      title: JSON.stringify(title),
      start_date: obj_data["start_date"] as string,
      end_date: obj_data["end_date"] as string,
      image_announcement: images,
    };

    loadingToast("Saving content...");

    try {
      setLoading(true);
      setError(CreateImageAnnouncementErrorState);
      const res_data = await createNewAllTypeAnnouncementApi(
        userApi,
        newImageAnnData
      );
      const form = e.target as HTMLFormElement;
      setTitle(new Delta());
      setImages([]);
      form.reset();
      update({ render: "Image Content Created", type: "success" });
      const redirect_conf = confirm(
        "New Image Announcement has been created. Do you want to be redirected to the Annoucement?"
      );
      if (redirect_conf) {
        navigate(`/dashboard/contents/image/${res_data.id}`);
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
    <div className="p-2 md:p-3">
      <Form onSubmitFunc={handleSubmit}>
        <div className="flex flex-col gap-2">
          <QuillEditor
            id="image-title"
            label="Announcement Title"
            value={title}
            onChange={handleTitleEditorChange}
            readonly={loading}
            ref={titleRef}
            error={error.title}
            placeholder="Create a title for your announcement"
            isTitle
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
          </div>
          <div className="w-full flex flex-col mt-5 ">
            <label
              htmlFor="create-image-file-upload"
              className="w-full flex flex-row items-center justify-center gap-2 bg-cyanBlue text-center text-xl font-bold py-2 cursor-pointer"
            >
              <FaPlusCircle className="text-3xl" />
              <span>Add Images</span>
            </label>
            <input
              type="file"
              id="create-image-file-upload"
              className="hidden invisible"
              onChange={handleUploadOnchange}
              disabled={loading}
            />
          </div>
          <div>
            <h3 className="bg-[#6e8ea4] px-5 py-2 text-xl font-bold">
              Uploaded Images
            </h3>
            <div className="mt-2">
              {images.length === 0 && (
                <div className="w-full text-center">
                  No image uploaded yet...
                </div>
              )}
              {images.map((image, index) => {
                const image_file = image.image as File;

                return (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-2 mt-4 bg-white dark:bg-gray-800 border rounded-lg shadow-md p-4"
                  >
                    <div>
                      {/* Image File */}
                      <img
                        src={URL.createObjectURL(image.image as File)}
                        alt={`Uploaded ${index}`}
                        className={`w-[500px] h-[280px] rounded-xl object-contain mx-auto ${
                          error.image_announcement[index]?.image &&
                          "border border-dashed border-red-600"
                        }`}
                      />

                      {/* Error Text */}
                      {error.image_announcement[index]?.image && (
                        <Errortext
                          text={error.image_announcement[index]?.image}
                        />
                      )}
                    </div>

                    {/* File Meta Data */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="text-sm sm:text-base">
                        <p className="font-bold truncate w-full">
                          {image_file.name}
                        </p>
                        <p className="text-gray-500">
                          {(image_file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex max-md:flex-col max-md:items-start items-center gap-2 justify-between">
                        <div className="min-w-64">
                          <Input
                            labelText="Display Duration"
                            type="text"
                            name={`image_announcement[${index}][duration]`}
                            value={image.duration as string}
                            onChange={(e) => handleDurationChange(e, index)}
                            error={error.image_announcement[index]?.duration}
                            disabled={loading}
                          />
                        </div>

                        <button
                          onClick={() => handleDeleteUpload(index)}
                          className="bg-red-500 hover:bg-red-700 active:bg-red-800 p-2 rounded-lg flex gap-2 items-center text-white md:mt-7"
                          type="button"
                          disabled={loading}
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
        </div>
      </Form>
    </div>
  );
};
export default CreateImageAnnouncement;
