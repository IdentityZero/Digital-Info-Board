import { useRef, useState } from "react";
import { Id, toast } from "react-toastify";

import { Button, Input } from "../../../components/ui";
import Accordion, { AccordionItem } from "../../../components/ui/Accordion";

import { useAuth } from "../../../context/AuthProvider";
import useLoadingToast from "../../../hooks/useLoadingToast";

import { createOrgMembersApi } from "../../../api/fixedContentRquests";
import { OrganizationMembersType } from "../../../types/FixedContentTypes";
import { FaUpload } from "react-icons/fa";
import { MAX_IMAGE_SIZE } from "../../../constants/api";

type CreateMemberProps = {
  onSuccess?: (newMember: OrganizationMembersType) => void;
};

const CreateMember = ({ onSuccess }: CreateMemberProps) => {
  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);

  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [image, setImage] = useState<string>();

  const handleImageOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (file.size > MAX_IMAGE_SIZE) {
      toast.warning("File size exceeds 10MB. Upload aborted.");
      e.target.value = "";
      return;
    }

    setImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    loading("Saving new member. Please wait...");

    try {
      setIsLoading(true);
      const res_data = await createOrgMembersApi(userApi, formData);
      if (onSuccess) onSuccess(res_data);
      update({
        render: "New member added.",
        type: "success",
      });
      formRef.current?.reset();
      setImage(undefined);
    } catch (error) {
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
        <AccordionItem title="Add New Member" isOpenInit={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4">
            <div className="flex flex-col h-[250px]">
              {image ? (
                <label htmlFor="image" className="w-full h-full cursor-pointer">
                  <img
                    src={image}
                    alt="uploaded-image"
                    className="h-[95%] w-[95%] object-contain"
                  />
                  <p className="text-sm text-center text-gray-600">
                    Click here or file to change upload.
                  </p>
                </label>
              ) : (
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center cursor-pointer h-full bg-gray-200"
                >
                  <FaUpload className="text-3xl" />
                  <p className="font-semibold">Upload member image</p>
                </label>
              )}
              <input
                required
                id="image"
                type="file"
                name="image"
                placeholder="Position (e.g. Department Chair, President)"
                accept="image/*"
                disabled={isLoading}
                className="sr-only"
                onChange={handleImageOnChange}
              />
            </div>
            <div className="flex flex-col">
              <Input
                labelText="Name"
                name="name"
                placeholder="Full Name (e.g. Engr. Juan Dela Cruz, Maria Clara)"
                required
                disabled={isLoading}
                maxLength={64}
                helpText={["Up to 64 characters allowed."]}
              />
              <Input
                labelText="Position"
                name="position"
                placeholder="Position (e.g. Department Chair, President)"
                required
                disabled={isLoading}
                maxLength={32}
                helpText={["Up to 32 characters allowed."]}
              />
              <div className="mt-2">
                <Button type="submit" disabled={isLoading}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </form>
  );
};
export default CreateMember;
