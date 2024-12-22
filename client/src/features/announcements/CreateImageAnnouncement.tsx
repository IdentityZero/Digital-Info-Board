import { useRef, useState } from "react";
import ReactQuill from "react-quill";
import { Delta } from "quill/core";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import QuillEditor, { isQuillValueEmpty } from "../../components/QuillEditor";
import { Input, Form, Errortext } from "../../components/ui";
import {
  type ImageAnnouncementCreateType,
  type CreateImageAnnouncementT,
} from "../../types/AnnouncementTypes";
import { createNewAllTypeAnnouncementApi } from "../../api/announcementRequest";
import { useAuth } from "../../context/AuthProvider";
import { CreateImageAnnouncementErrorState } from "./helpers";

const CreateImageAnnouncement = () => {
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
      alert("This image is already uploaded");
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
      return;
    }

    if (images.length === 0) {
      alert("Upload images...");
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
          alert("Unexpected error occured. Please try again.");
        }
        setError((prev) => ({
          ...prev,
          ...err,
        }));
      } else {
        alert("Unexpected error occured. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
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
            />
          </div>
          <div>
            <h3 className="bg-[#6e8ea4] px-5 py-2 text-xl font-bold">
              Uploaded Videos
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
                    className="flex items-center justify-between gap-2 py-3 mb-2 border-t-2 border-b-2 border-gray-500"
                  >
                    <span className="flex-1">
                      <img
                        src={URL.createObjectURL(image.image as File)}
                        alt={`Uploaded ${index}`}
                        className={`w-[150px] h-auto m-[10px] ${
                          error.image_announcement[index]?.image &&
                          "border border-dashed border-red-600"
                        }`}
                      />
                      {error.image_announcement[index]?.image && (
                        <Errortext
                          text={error.image_announcement[index]?.image}
                        />
                      )}
                    </span>
                    <span className=" flex-1 text-center">
                      {image_file.name}
                    </span>
                    <span className="flex-1 text-center">
                      <Input
                        ctrl_type="controlled"
                        label=""
                        type="text"
                        name={`image_announcement[${index}][duration]`}
                        inputValue={image.duration as string}
                        setInputValue={(e) => handleDurationChange(e, index)}
                        error={error.image_announcement[index]?.duration}
                        disabled={loading}
                      />
                    </span>
                    <span className="flex-1 text-center">
                      {(image_file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <span className="flex-1 text-center">
                      <button
                        onClick={() => handleDeleteUpload(index)}
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
          <div className="w-full mt-2 flex justify-end">
            <button
              className={`px-10 py-2 rounded-full border border-black mr-2 ${
                false
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