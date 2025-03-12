import { useRef, useState } from "react";
import { Id } from "react-toastify";

import { Button, Input } from "../../../components/ui";
import Accordion, { AccordionItem } from "../../../components/ui/Accordion";

import { useAuth } from "../../../context/AuthProvider";
import useLoadingToast from "../../../hooks/useLoadingToast";

import { createOrgMembersApi } from "../../../api/fixedContentRquests";
import { OrganizationMembersType } from "../../../types/FixedContentTypes";

type CreateMemberProps = {
  onSuccess?: (newMember: OrganizationMembersType) => void;
};

const CreateMember = ({ onSuccess }: CreateMemberProps) => {
  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);

  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        <AccordionItem title="Add New Member">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              required
              type="file"
              labelText="Image"
              name="image"
              placeholder="Position (e.g. Department Chair, President)"
              accept="image/*"
              disabled={isLoading}
            />
          </div>
          <div className="mt-2">
            <Button type="submit" disabled={isLoading}>
              Submit
            </Button>
          </div>
        </AccordionItem>
      </Accordion>
    </form>
  );
};
export default CreateMember;
