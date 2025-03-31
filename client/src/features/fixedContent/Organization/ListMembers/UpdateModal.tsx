import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Id } from "react-toastify";

import Modal from "../../../../components/ui/Modal";
import LoadingMessage from "../../../../components/LoadingMessage";
import { Button, Errortext, Input } from "../../../../components/ui";

import { useAuth } from "../../../../context/AuthProvider";
import useLoadingToast from "../../../../hooks/useLoadingToast";

import {
  retrieveOrgMemberApi,
  updateOrgMemberApi,
} from "../../../../api/fixedContentRquests";
import { OrganizationMembersType } from "../../../../types/FixedContentTypes";
import { orgMemberInitError } from "./helpers";

type UpdateModalProps = {
  id: number;
  onClose: () => void;
  onSuccess?: (data: OrganizationMembersType) => void;
};

const UpdateModal = ({ id, onClose, onSuccess }: UpdateModalProps) => {
  /**
   * Used for Updating Organization members information
   */

  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);

  const [newImage, setNewImage] = useState<string | null>(null);
  const [orgMemberData, setOrgMemberData] =
    useState<OrganizationMembersType | null>(null);

  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(orgMemberInitError);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const res_data = await retrieveOrgMemberApi(userApi, id);
        setOrgMemberData(res_data);
      } catch (error) {
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!orgMemberData) return;

    const formData = new FormData(e.currentTarget);

    if (!newImage) {
      formData.delete("image");
    }
    loading("Saving updates. Please wait...");

    try {
      setIsSaving(true);
      setError(orgMemberInitError);
      const res_data = await updateOrgMemberApi(userApi, id, formData);
      update({
        render: "Update successful",
        type: "success",
      });
      onClose();
      onSuccess && onSuccess(res_data);
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        update({
          render: "Update unsuccessful",
          type: "error",
        });
        return;
      }

      const err = error.response?.data;

      if (!err) {
        update({
          render: "Update unsuccessful",
          type: "error",
        });
      }

      setError(err);
      update({
        render: "Check errors before submitting...",
        type: "warning",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    setNewImage(URL.createObjectURL(file));
  };

  return (
    <Modal
      isOpen={!!id}
      onClose={onClose}
      size="xl"
      title="Update Organization Member Info"
    >
      {isFetching ? (
        <LoadingMessage message="Retrieving information..." />
      ) : orgMemberData ? (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="relative flex flex-col items-center">
            <label htmlFor="image-upload" className="cursor-pointer">
              <img
                src={newImage || orgMemberData.image}
                alt={orgMemberData.name || "Organization Member"}
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
              <p className="text-sm text-blue-500 hover:underline text-center mt-2">
                Click to update
              </p>
            </label>
            <input
              type="file"
              name="image"
              id="image-upload"
              className="sr-only"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isSaving}
            />

            {newImage && (
              <button
                type="button"
                disabled={isSaving}
                className="absolute top-0 right-0 text-gray-700 text-xs p-1 rounded-sm hover:bg-black/50 hover:text-white transition"
                onClick={() => setNewImage(null)}
              >
                Reset image
              </button>
            )}
            {error.image && <Errortext text={error.image} />}
          </div>

          <Input
            labelText="Name"
            defaultValue={orgMemberData.name}
            name="name"
            placeholder="Full Name (e.g. Engr. Juan Dela Cruz, Maria Clara)"
            required
            maxLength={64}
            helpText={["Up to 64 characters allowed."]}
            disabled={isSaving}
            error={error.name}
          />
          <Input
            labelText="Position"
            defaultValue={orgMemberData.position}
            name="position"
            placeholder="Position (e.g. Department Chair, President)"
            required
            maxLength={32}
            helpText={["Up to 32 characters allowed."]}
            disabled={isSaving}
            error={error.position}
          />
          <input
            type="hidden"
            value={orgMemberData.last_modified}
            name="last_modified"
            disabled
          />
          <Button disabled={isSaving} type="submit">
            Update
          </Button>
        </form>
      ) : (
        <NotFound />
      )}
    </Modal>
  );
};
export default UpdateModal;

function NotFound() {
  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Member Not Found</h2>
      <p className="text-gray-600 mt-2">
        Information about the member is not available.
      </p>
      <div className="mt-2">
        <Button>Refresh</Button>
      </div>
    </div>
  );
}
