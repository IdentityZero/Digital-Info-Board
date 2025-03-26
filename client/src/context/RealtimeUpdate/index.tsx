import React, { createContext, useContext } from "react";

import { LIVE_CONTENT_UPDATE_URL } from "../../constants/urls";

import useAnnouncementData from "./useAnnouncementData";
import useWebsocket from "../../hooks/useWebsocket";
import useSiteSettingsUpdatable from "./useSiteSettingsUpdatable";

import { AnnouncementListType } from "../../types/AnnouncementTypes";
import { SettingsType } from "../../types/SettingTypes";
import useOrgMembersData from "./useOrgMembersData";
import {
  MediaDisplayType,
  OrganizationMembersType,
  UpcomingEventType,
} from "../../types/FixedContentTypes";
import useUpcomingEventsData from "./useUpcomingEventsData";
import useMediaDisplaysData from "./useMediaDisplaysData";

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
  orgMembers: {
    orgMembers: OrganizationMembersType[];
    isLoading: boolean;
  };
  events: {
    events: UpcomingEventType[];
    isLoading: boolean;
  };
  mediaDisplays: {
    mediaDisplays: MediaDisplayType[];
    isLoading: boolean;
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

type OrganizationWsMessageTypes = {
  content: "organization";
  action: "create" | "delete" | "sequence_update";
  content_id: number;
  data: any;
};

type UpcomingEventsWsMessageTypes = {
  content: "upcoming_events";
  action: "create" | "delete";
  content_id: number;
  data: any;
};

type MediaDisplaysWsMessageTypes = {
  content: "media_displays";
  action: "create" | "delete" | "sequence_update";
  content_id: number;
  data: any;
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
  const orgMembers = useOrgMembersData();
  const events = useUpcomingEventsData();
  const mediaDisplays = useMediaDisplaysData();

  const handleOnWsMessage = (
    data:
      | AnnouncementWsMessageTypes
      | SettingsWsMessageTypes
      | OrganizationWsMessageTypes
      | UpcomingEventsWsMessageTypes
      | MediaDisplaysWsMessageTypes
  ) => {
    if (data.content === "announcement") {
      handleAnnouncementContent(data);
    } else if (data.content === "settings") {
      handleSettingsContent(data);
    } else if (data.content === "organization") {
      handleOrganizationContent(data);
    } else if (data.content === "upcoming_events") {
      handleUpcomingEventsContent(data);
    } else if (data.content === "media_displays") {
      handleMediaDisplaysContent(data);
    }
  };

  const handleMediaDisplaysContent = (data: MediaDisplaysWsMessageTypes) => {
    if (data.action === "create") {
      mediaDisplays.insertItem(data.data);
    } else if (data.action === "delete") {
      mediaDisplays.deleteItem(data.content_id);
    } else if (data.action === "sequence_update") {
      mediaDisplays.updateSequence(data.data);
    }
  };

  const handleUpcomingEventsContent = (data: UpcomingEventsWsMessageTypes) => {
    if (data.action === "create") {
      events.insertItem(data.data);
    } else if (data.action === "delete") {
      events.deleteItem(data.content_id);
    }
  };

  const handleOrganizationContent = (data: OrganizationWsMessageTypes) => {
    if (data.action === "delete") {
      orgMembers.deleteItem(data.content_id);
    } else if (data.action === "create") {
      orgMembers.insertItem(data.data);
    } else if (data.action === "sequence_update") {
      orgMembers.updateSequence(data.data);
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
        orgMembers,
        events,
        mediaDisplays,
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
