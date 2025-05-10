import { Id } from "react-toastify";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import Modal from "../../../../components/ui/Modal";
import ButtonV2 from "../../../../components/ui/ButtonV2";
import { Button, Errortext, Input } from "../../../../components/ui";
import LoadingMessage from "../../../../components/LoadingMessage";

import { useAuth } from "../../../../context/AuthProvider";
import useLoadingToast from "../../../../hooks/useLoadingToast";

import { MediaDisplayType } from "../../../../types/FixedContentTypes";
import {
  retrieveMediaDisplayApi,
  updateMediaDisplayApi,
} from "../../../../api/fixedContentRquests";
import { mediaDisplayInitError } from "./helpers";

type UpdateModalProps = {
  id: number;
  onClose: () => void;
  refreshList?: () => void;
  onSuccess?: (data: MediaDisplayType) => void;
};

const UpdateModal = ({
  id,
  onClose,
  refreshList,
  onSuccess,
}: UpdateModalProps) => {
  /**
   * Update modal for Media Displays
   */

  const { userApi } = useAuth();
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);

  const [mediaDisplay, setMediaDisplay] = useState<MediaDisplayType | null>(
    null
  );
  const [newFile, setNewFile] = useState<{
    type: "video" | "image";
    file: string;
  } | null>(null);

  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(mediaDisplayInitError);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const res_data = await retrieveMediaDisplayApi(userApi, id);
        setMediaDisplay(res_data);
      } catch (error) {
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (!file.type.includes("image/") && !file.type.includes("video/")) {
      alert("Unsupported file type");
      return;
    }
    setNewFile({
      type: file.type.includes("image") ? "image" : "video",
      file: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (!newFile) {
      formData.delete("file");
    }

    loading("Saving updates. Please wait...");

    try {
      setIsSaving(true);
      setError(mediaDisplayInitError);
      const res_data = await updateMediaDisplayApi(userApi, id, formData);
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
        return;
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

  return (
    <Modal
      isOpen={!!id}
      onClose={onClose}
      size="xl"
      title="Update Media Display Info"
    >
      {isFetching ? (
        <LoadingMessage message="Retrieving information..." />
      ) : mediaDisplay ? (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="relative flex flex-col items-center">
            <label htmlFor="file-upload" className="cursor-pointer">
              {newFile ? (
                newFile.type === "image" ? (
                  <img
                    src={newFile.file}
                    alt={"New file"}
                    className="w-80 h-80 object-contain mx-auto"
                  />
                ) : (
                  <video
                    src={newFile.file}
                    className="w-80 h-80 object-contain mx-auto"
                    controls
                  >
                    Not supported.
                  </video>
                )
              ) : mediaDisplay.type === "image" ? (
                <img
                  src={mediaDisplay.file}
                  alt={mediaDisplay.name || "Media File"}
                  className="w-80 h-80 object-contain mx-auto"
                />
              ) : (
                <video
                  src={mediaDisplay.file}
                  className="w-80 h-80 object-contain mx-auto"
                  controls
                >
                  Not supported.
                </video>
              )}

              <p className="text-sm text-blue-500 hover:underline text-center mt-2">
                Click to update
              </p>
            </label>
            <input
              type="file"
              name="file"
              id="file-upload"
              className="sr-only"
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={isSaving}
            />

            {newFile && (
              <button
                type="button"
                disabled={isSaving}
                className="absolute top-0 right-0 text-gray-700 text-xs p-1 rounded-sm hover:bg-black/50 hover:text-white transition"
                onClick={() => setNewFile(null)}
              >
                Reset image
              </button>
            )}
            {error.file && <Errortext text={error.file} />}
          </div>
          <Input
            labelText="Name"
            defaultValue={mediaDisplay.name}
            name="name"
            placeholder="Full Name (e.g. Engr. Juan Dela Cruz, Maria Clara)"
            required
            maxLength={64}
            helpText={["Up to 64 characters allowed."]}
            disabled={isSaving}
            error={error.name}
          />
          <ButtonV2 disabled={isSaving} type="submit" text="Update" />
        </form>
      ) : (
        <NotFound refreshList={refreshList} />
      )}
    </Modal>
  );
};
export default UpdateModal;

function NotFound({ refreshList }: { refreshList?: () => void }) {
  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Display Not Found</h2>
      <p className="text-gray-600 mt-2">
        Information about the media display is not available.
      </p>
      {refreshList && (
        <div className="mt-2">
          <Button onClick={refreshList}>Refresh</Button>
        </div>
      )}
    </div>
  );
}
