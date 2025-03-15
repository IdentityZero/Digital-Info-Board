import { useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { Id } from "react-toastify";

import { Button, Input } from "../../../components/ui";
import Accordion, { AccordionItem } from "../../../components/ui/Accordion";

import useLoadingToast from "../../../hooks/useLoadingToast";
import { useAuth } from "../../../context/AuthProvider";

import { createMediaDisplayApi } from "../../../api/fixedContentRquests";
import { MediaDisplayType } from "../../../types/FixedContentTypes";

type CreateMediaDisplayProps = {
  onSuccess?: (newDisplay: MediaDisplayType) => void;
};

const CreateMediaDisplay = ({ onSuccess }: CreateMediaDisplayProps) => {
  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);

  const [file, setFile] = useState<{ type: "video" | "image"; file: string }>();

  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (!file.type.includes("image/") && !file.type.includes("video/")) {
      alert("Unsupported file type");
      return;
    }

    setFile({
      type: file.type.includes("image") ? "image" : "video",
      file: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    loading("Saving new media display. Please wait...");

    try {
      setIsLoading(true);
      const res_data = await createMediaDisplayApi(userApi, formData);
      if (onSuccess) onSuccess(res_data);
      update({
        render: "New media display added.",
        type: "success",
      });
      formRef.current?.reset();
      setFile(undefined);
    } catch (error) {
      console.log(error);

      update({
        render: "Failed to save. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form encType="multipart/form-data" onSubmit={handleSubmit} ref={formRef}>
      <Accordion>
        <AccordionItem title="Add New Media Display" isOpenInit={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Input
                labelText="Name"
                name="name"
                placeholder="Name (e.g. CpE Fact, MMSU Hymn)"
                required
                maxLength={64}
                helpText={["Up to 64 characters allowed."]}
                disabled={isLoading}
              />
              <div>
                <Button type="submit">Submit</Button>
              </div>
            </div>
            <div className="w-full flex flex-col items-center justify-center bg-gray-200 h-[250px]">
              {file ? (
                <label htmlFor="file" className="cursor-pointer">
                  {file.type === "image" ? (
                    <img
                      src={file.file}
                      alt="Uploaded Preview"
                      className="max-h-[200px] max-w-[300px]"
                    />
                  ) : (
                    <video
                      src={file.file}
                      className="max-h-[200px] max-w-[300px]"
                      controls
                    >
                      Not supported
                    </video>
                  )}
                </label>
              ) : (
                <label
                  htmlFor="file"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <FaUpload className="text-3xl" />
                  <p className="font-semibold">Upload an image or video</p>
                </label>
              )}
              {file && (
                <label
                  className="text-sm text-center text-gray-400 cursor-pointer"
                  htmlFor="file"
                >
                  Click here or file to change upload.
                </label>
              )}
              <input
                type="file"
                name="file"
                id="file"
                required
                className="sr-only"
                accept="image/*,video/*"
                onChange={handleFileOnChange}
                disabled={isLoading}
              />
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </form>
  );
};
export default CreateMediaDisplay;
