import { useRef, useState } from "react";
import { Id } from "react-toastify";
import { useLocation } from "react-router-dom";

import { useAuth } from "../../../context/AuthProvider";
import useLoadingToast from "../../../hooks/useLoadingToast";

import {
  type AnnouncementListType,
  AnnouncementRetrieveType,
} from "../../../types/AnnouncementTypes";
import { updateAnnouncementApi } from "../../../api/announcementRequest";

import PreviewAnnouncement from "../PreviewAnnouncement";
import AnnouncementActivationCard from "../components/AnnouncementActivationCard";
import { handleDisplayPreviewClick } from "./helper";

type ListInactiveAnnouncementProps = {
  inactiveAnnouncements: AnnouncementListType;

  setInactiveAnnouncements: (updatedList: AnnouncementRetrieveType[]) => void;
};

const ListInactiveAnnouncement = ({
  inactiveAnnouncements,
  setInactiveAnnouncements,
}: ListInactiveAnnouncementProps) => {
  const { hash } = useLocation();
  const targetId = hash.substring(1);

  const toastId = useRef<Id | null>(null);
  const { loading, update } = useLoadingToast(toastId);
  const { userApi } = useAuth();

  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [dataToPreview, setDataToPreview] = useState<
    AnnouncementRetrieveType | undefined
  >(undefined);

  const handleApproveClick = async (id: string, data: any) => {
    const approve_confirm = window.confirm(
      "Are you sure you want to approve this Content?"
    );

    if (!approve_confirm) return;

    loading(`Approving - ${id}. Please wait...`);

    try {
      await updateAnnouncementApi(userApi, id, data);
      const updatedData = inactiveAnnouncements.find(
        (announcement) => announcement.id === id
      );
      if (updatedData) {
        const updatedInActiveList = [
          inactiveAnnouncements.filter(
            (announcement) => announcement.id !== id
          ),
        ][0];

        update({ render: "Activation successful", type: "success" });

        setInactiveAnnouncements(updatedInActiveList);
      }
    } catch (error) {
      update({
        render: "Activation unsuccessful. Please try again.",
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
      {inactiveAnnouncements.map((announcement) => {
        return (
          <AnnouncementActivationCard
            key={announcement.id}
            announcement={announcement as AnnouncementRetrieveType}
            handleActivationClick={handleApproveClick}
            setShowPreview={setShowPreview}
            setDataToPreview={setDataToPreview}
            isHighlighted={targetId == announcement.id}
            handleDisplayPreviewClick={handleDisplayPreviewClickfnc}
          />
        );
      })}
    </div>
  );
};

export default ListInactiveAnnouncement;
