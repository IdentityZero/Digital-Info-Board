import React, { createContext, useContext } from "react";

import useAnnouncementData from "./announcement/useAnnouncementData";
import useWebsocket from "../../hooks/useWebsocket";

import { LIVE_CONTENT_UPDATE_URL } from "../../constants/urls";

import { AnnouncementListType } from "../../types/AnnouncementTypes";
import useSiteSettingsUpdatable from "./announcement/useSiteSettingsUpdatable";
import { SettingsType } from "../../types/SettingTypes";

type RealtimeUpdateContextType = {
  announcement: {
    announcementList: AnnouncementListType;
    idOnLock: string;
    setIdOnLock: React.Dispatch<React.SetStateAction<string>>;
    mediaAnnouncements: AnnouncementListType;
    textAnnouncements: AnnouncementListType;
    textAnnouncementsAsText: string[];
    mediaDurations: number[];
    isLoading: boolean;
    error: any;
  };
  settings: {
    settings: SettingsType | undefined;
    isLoading: boolean;
    setSettings: React.Dispatch<React.SetStateAction<SettingsType | undefined>>;
  };
};

type AnnouncementWsMessageTypes = {
  content: "announcement";
  action:
    | "update"
    | "create"
    | "delete"
    | "activate"
    | "deactivate"
    | "sequence_update";
  content_id: string;
  data: any;
};

type SettingsWsMessageTypes = {
  content: "settings";
  action: "update";
  data: SettingsType;
};

const RealtimeUpdateContext = createContext<
  RealtimeUpdateContextType | undefined
>(undefined);

export const RealtimeUpdateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const announcement = useAnnouncementData();
  const settings = useSiteSettingsUpdatable();

  const handleOnWsMessage = (
    data: AnnouncementWsMessageTypes | SettingsWsMessageTypes
  ) => {
    if (data.content === "announcement") {
      handleAnnouncementContent(data);
    } else if (data.content === "settings") {
      handleSettingsContent(data);
    }
  };

  const handleSettingsContent = (data: SettingsWsMessageTypes) => {
    if (data.action === "update") {
      settings.setSettings(data.data);
    }
  };

  const handleAnnouncementContent = (data: AnnouncementWsMessageTypes) => {
    if (data.action === "update") {
      announcement.updateItem(data.content_id, data.data);
    } else if (data.action === "create") {
      announcement.fetchAndInsertItem(data.content_id);
    } else if (data.action === "delete") {
      announcement.deleteItem(data.content_id);
    } else if (data.action === "activate") {
      announcement.insertItem(data.data);
    } else if (data.action === "deactivate") {
      announcement.deleteItem(data.content_id);
    } else if (data.action === "sequence_update") {
      announcement.updateSequence(data.data);
    }
  };

  useWebsocket(LIVE_CONTENT_UPDATE_URL, handleOnWsMessage);

  return (
    <RealtimeUpdateContext.Provider
      value={{
        announcement,
        settings,
      }}
    >
      {children}
    </RealtimeUpdateContext.Provider>
  );
};

export const useRealtimeUpdate = () => {
  const context = useContext(RealtimeUpdateContext);
  if (context === undefined)
    throw new Error(
      "useRealtimeUpdate must be within the RealtimeUpdateContext"
    );
  return context;
};
