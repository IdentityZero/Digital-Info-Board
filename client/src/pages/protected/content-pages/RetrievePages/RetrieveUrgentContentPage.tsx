import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Delta } from "quill/core";
import { Id } from "react-toastify";
import { FaArrowLeft, FaEdit, FaTrashAlt, FaTv } from "react-icons/fa";

import LoadingOrErrorWrapper from "../../../../components/LoadingOrErrorWrapper";
import DisplayQuillEditor from "../../../../components/DisplayQuillEditor";

import { useAuth } from "../../../../context/AuthProvider";
import useLoadingToast from "../../../../hooks/useLoadingToast";

import { formatTimestamp } from "../../../../utils/formatters";

import { UrgentAnnouncementType } from "../../../../types/AnnouncementTypes";

import {
  deleteUrgentAnnouncementApi,
  retrieveUrgentAnnouncementApi,
  runUrgentAnnouncementApi,
} from "../../../../api/announcementRequest";

const RetrieveUrgentContentPage = () => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { id } = useParams();
  const { userApi } = useAuth();
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState<UrgentAnnouncementType>();
  const [isFetching, setIsFetching] = useState(true);
  const [hasFetchingError, setHasFetchingError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setIsFetching(true);
        const res_data = await retrieveUrgentAnnouncementApi(
          userApi,
          id as string
        );
        setAnnouncement(res_data);
      } catch (error) {
        setHasFetchingError(true);
      } finally {
        setIsFetching(false);
      }
    };
    fetchAnnouncement();
  }, []);

  const handleDelete = async () => {
    const conf = confirm("Are you sure you want to delete this content?");

    if (!conf) return;
    setIsDeleting(true);
    loading("Deleting content. Please wait!");
    try {
      await deleteUrgentAnnouncementApi(userApi, Number(id));
      update({ render: "Delete successful", type: "success" });
      navigate("/dashboard/contents/urgent");
    } catch (error) {
      update({
        render: "Delete unsuccessful. Please try again.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRunUrgent = async () => {
    loading("Sending run urgent command. Please wait...");
    try {
      await runUrgentAnnouncementApi(userApi, Number(id));
      update({ render: "Command sent succesfully.", type: "success" });
    } catch (error) {
      update({ render: "Command failed. Please try again.", type: "error" });
    }
  };

  return (
    <div className="p-4">
      <div className="mb-2 flex flex-col md:flex-row md:justify-between gap-2">
        {/* Back Button */}
        <div className="w-full md:w-auto">
          <Link to="/dashboard/contents/urgent">
            <button className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-1 rounded-full border border-black bg-lightBlue hover:bg-lightBlue-300 active:bg-lightBlue-500">
              <FaArrowLeft />
              Back to list
            </button>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Link to={`/dashboard/contents/urgent/${id}/edit`}>
            <button className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-1 rounded-full border border-black bg-green-500 text-white hover:bg-green-600 active:bg-green-700">
              <FaEdit />
              Edit
            </button>
          </Link>

          <button
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-1 rounded-full border border-black bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <FaTrashAlt />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>

          <button
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-1 rounded-full border border-black bg-btSecondary text-white hover:bg-btSecondary-hover active:bg-btSecondary-active"
            onClick={handleRunUrgent}
          >
            <FaTv />
            Show in Display
          </button>
        </div>
      </div>

      <LoadingOrErrorWrapper isLoading={isFetching} hasError={hasFetchingError}>
        <DisplayQuillEditor isTitle value={announcement?.title as Delta} />
        <DisplayQuillEditor value={announcement?.description as Delta} />
        <div className="bg-white w-full shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Related Information
            </h3>
            <p className="mt-1 w-full text-sm text-gray-500">
              Details and informations about author and announcement.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Author Image
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={`${announcement?.author.profile.image}`}
                    alt="Author"
                  />
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Author Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                  {announcement?.author.first_name +
                    " " +
                    announcement?.author.last_name}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Author Role - Position
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                  {announcement?.author.profile.role +
                    " - " +
                    announcement?.author.profile.position}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {announcement?.duration}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Last Modified
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatTimestamp(announcement?.last_modified as string)}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Created at
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatTimestamp(announcement?.created_at as string)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </LoadingOrErrorWrapper>
    </div>
  );
};
export default RetrieveUrgentContentPage;
