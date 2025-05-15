import {
  AnnouncementListType,
  AnnouncementRetrieveType,
  UrgentAnnouncementType,
} from "../../types/AnnouncementTypes";

import {
  MediaDisplayType,
  OrganizationMembersType,
  SensorDataType,
  UpcomingEventType,
} from "../../types/FixedContentTypes";
import { SettingsType } from "../../types/SettingTypes";

export type RealtimeUpdateContextType = {
  announcement: {
    announcementList: AnnouncementListType;
    idOnLock: string;
    setIdOnLock: React.Dispatch<React.SetStateAction<string>>;
    mediaAnnouncements: AnnouncementListType;
    textAnnouncements: AnnouncementListType;
    textAnnouncementsAsText: string[];
    preview: AnnouncementRetrieveType | null;
    urgentAnnouncement: UrgentAnnouncementType | null;
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
  sensorData: {
    sensorData: SensorDataType;
  };
  isReady: boolean;
};

export type AnnouncementWsMessageTypes = {
  content: "announcement";
  action:
    | "update"
    | "create"
    | "delete"
    | "activate"
    | "deactivate"
    | "sequence_update"
    | "preview"
    | "urgent";
  content_id: string;
  data: any;
};

export type SettingsWsMessageTypes = {
  content: "settings";
  action: "update";
  data: SettingsType;
};

export type OrganizationWsMessageTypes = {
  content: "organization";
  action: "create" | "update" | "delete" | "sequence_update";
  content_id: number;
  data: any;
};

export type UpcomingEventsWsMessageTypes = {
  content: "upcoming_events";
  action: "create" | "update" | "delete";
  content_id: number;
  data: any;
};

export type MediaDisplaysWsMessageTypes = {
  content: "media_displays";
  action: "create" | "update" | "delete" | "sequence_update";
  content_id: number;
  data: any;
};

export type RefreshPageType = {
  content: "refresh_page";
};

export type SensorWsMessageTypes = {
  content: "sensor";
  action: "update";
  data: SensorDataType;
};
