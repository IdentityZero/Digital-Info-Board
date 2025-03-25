import React, { createContext, useContext } from "react";

import useAnnouncementData from "./announcement/useAnnouncementData";

import { AnnouncementListType } from "../../types/AnnouncementTypes";
import { LIVE_CONTENT_UPDATE_URL } from "../../constants/urls";
import useWebsocket from "../../hooks/useWebsocket";

type RealtimeUpdateContextType = {
  announcement: {
    announcementList: AnnouncementListType;
    mediaAnnouncements: AnnouncementListType;
    textAnnouncements: AnnouncementListType;
    textAnnouncementsAsText: string[];
    mediaDurations: number[];
    isLoading: boolean;
    error: any;
  };
};

const RealtimeUpdateContext = createContext<
  RealtimeUpdateContextType | undefined
>(undefined);

export const RealtimeUpdateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const handleOnWsMessage = (data: any) => {
    console.log(data);
  };

  useWebsocket(LIVE_CONTENT_UPDATE_URL, handleOnWsMessage);

  const announcement = useAnnouncementData();

  return (
    <RealtimeUpdateContext.Provider
      value={{
        announcement,
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
