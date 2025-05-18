import { useRef, useState } from "react";
import { Id } from "react-toastify";

import { useAuth } from "../../../context/AuthProvider";
import useLoadingToast from "../../../hooks/useLoadingToast";

import { updateAnnouncementApi } from "../../../api/announcementRequest";
import {
  AnnouncementListType,
  AnnouncementRetrieveType,
} from "../../../types/AnnouncementTypes";

import PreviewAnnouncement from "../PreviewAnnouncement";
import AnnouncementActivationCard from "../components/AnnouncementActivationCard";
import { handleDisplayPreviewClick } from "./helper";

const ListActiveAnnouncement = ({
  activeAnnouncements,
  setActiveAnnouncements,
}: {
  activeAnnouncements: AnnouncementListType;
  setActiveAnnouncements: (updatedList: AnnouncementRetrieveType[]) => void;
}) => {
  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [dataToPreview, setDataToPreview] = useState<
    AnnouncementRetrieveType | undefined
  >(undefined);

  const handleDeactivateClick = async (id: string, data: any) => {
    const deactivate_confirm = window.confirm(
      "Are you sure you want to deactivate this Content?"
    );

    if (!deactivate_confirm) return;
    loading(`Deactivating - ${id}. Please wait...`);
    try {
      await updateAnnouncementApi(userApi, id, data);
      const updatedData = activeAnnouncements.find(
        (announcement) => announcement.id === id
      );
      if (updatedData) {
        const updatedActiveList = [
          activeAnnouncements.filter((announcement) => announcement.id !== id),
        ][0];

        setActiveAnnouncements(updatedActiveList);
      }
      update({ render: "Deactivation successful", type: "success" });
    } catch (error) {
      update({
        render: "Deactivation unsuccessful. Please try again.",
        type: "error",
      });
    }
  };

  const handleDisplayPreviewClickfnc = (id: string) => {
    handleDisplayPreviewClick(id, loading, update, userApi);
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      {showPreview && (
        <PreviewAnnouncement
          setShowPreview={setShowPreview}
          data={dataToPreview as AnnouncementRetrieveType}
        />
      )}
      {activeAnnouncements.map((announcement) => {
        return (
          <AnnouncementActivationCard
            announcement={announcement}
            key={announcement.id}
            handleActivationClick={handleDeactivateClick}
            setShowPreview={setShowPreview}
            setDataToPreview={setDataToPreview}
            handleDisplayPreviewClick={handleDisplayPreviewClickfnc}
          />
        );
      })}
    </div>
  );
};

export default ListActiveAnnouncement;
