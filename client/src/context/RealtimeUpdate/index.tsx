import React, { createContext, useContext, useEffect, useState } from "react";

import { LIVE_CONTENT_UPDATE_URL } from "../../constants/urls";

import useAnnouncementData from "./useAnnouncementData";
import useWebsocket from "../../hooks/useWebsocket";
import useSiteSettingsUpdatable from "./useSiteSettingsUpdatable";

import useOrgMembersData from "./useOrgMembersData";
import useUpcomingEventsData from "./useUpcomingEventsData";
import useMediaDisplaysData from "./useMediaDisplaysData";
import useSensorData from "./useSensorData";

import {
  AnnouncementWsMessageTypes,
  MediaDisplaysWsMessageTypes,
  OrganizationWsMessageTypes,
  RealtimeUpdateContextType,
  RefreshPageType,
  SensorWsMessageTypes,
  SettingsWsMessageTypes,
  UpcomingEventsWsMessageTypes,
} from "./types";

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
  const sensorData = useSensorData();

  const [isWsReady, setIsWsReady] = useState(false);

  const isReady =
    announcement.isReady &&
    orgMembers.isReady &&
    events.isReady &&
    mediaDisplays.isReady &&
    isWsReady;

  const handleOnWsMessage = (
    data:
      | AnnouncementWsMessageTypes
      | SettingsWsMessageTypes
      | OrganizationWsMessageTypes
      | UpcomingEventsWsMessageTypes
      | MediaDisplaysWsMessageTypes
      | RefreshPageType
      | SensorWsMessageTypes
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
    } else if (data.content === "refresh_page") {
      window.location.reload();
    } else if (data.content === "sensor") {
      sensorData.setSensorData(data.data);
    } else {
      // Connection established
      setIsWsReady(true);
    }
  };

  const handleMediaDisplaysContent = (data: MediaDisplaysWsMessageTypes) => {
    if (data.action === "create") {
      mediaDisplays.insertItem(data.data);
    } else if (data.action === "delete") {
      mediaDisplays.deleteItem(data.content_id);
    } else if (data.action === "sequence_update") {
      mediaDisplays.updateSequence(data.data);
    } else if (data.action === "update") {
      mediaDisplays.updateItem(data.content_id, data.data);
    }
  };

  const handleUpcomingEventsContent = (data: UpcomingEventsWsMessageTypes) => {
    if (data.action === "create") {
      events.insertItem(data.data);
    } else if (data.action === "delete") {
      events.deleteItem(data.content_id);
    } else if (data.action === "update") {
      events.updateItem(data.content_id, data.data);
    }
  };

  const handleOrganizationContent = (data: OrganizationWsMessageTypes) => {
    if (data.action === "delete") {
      orgMembers.deleteItem(data.content_id);
    } else if (data.action === "create") {
      orgMembers.insertItem(data.data);
    } else if (data.action === "sequence_update") {
      orgMembers.updateSequence(data.data);
    } else if (data.action === "update") {
      orgMembers.updateItem(data.content_id, data.data);
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
    } else if (data.action === "preview") {
      announcement.setDisplayPreview(data.data);
    }
  };

  const { isConnectionOpen } = useWebsocket(
    LIVE_CONTENT_UPDATE_URL,
    handleOnWsMessage
  );

  useEffect(() => {
    if (!isConnectionOpen) return;
    announcement.fetchAnnouncements();
    mediaDisplays.fetchMediaDisplays();
    settings.fetchSettings();
    orgMembers.fetchOrgMembers();
    events.fetchEvents();
  }, [isConnectionOpen]);

  return (
    <RealtimeUpdateContext.Provider
      value={{
        sensorData,
        announcement,
        settings,
        orgMembers,
        events,
        mediaDisplays,
        isReady,
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
