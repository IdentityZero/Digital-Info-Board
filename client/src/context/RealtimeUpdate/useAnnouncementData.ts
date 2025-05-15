import { useEffect, useState } from "react";
import axios from "axios";

import {
  addTotalDuration,
  convertDurationToSeconds,
  sortItemsByPosition,
} from "../../utils/utils";
import { extractReactQuillText } from "../../utils/formatters";

import {
  AnnouncementListType,
  AnnouncementRetrieveType,
  UrgentAnnouncementType,
} from "../../types/AnnouncementTypes";
import {
  listActiveAnnouncementApi,
  retrieveTextAnnouncementApi,
} from "../../api/announcementRequest";

const useAnnouncementData = () => {
  const [announcementList, setAnnouncementList] =
    useState<AnnouncementListType>([]);
  const [mediaAnnouncements, setMediaAnnouncements] =
    useState<AnnouncementListType>([]);
  const [textAnnouncements, setTextAnnouncements] =
    useState<AnnouncementListType>([]);
  const [textAnnouncementsAsText, setTextAnnouncementsAsText] = useState<
    string[]
  >([]);
  const [idOnLock, setIdOnLock] = useState<string>("");
  const [urgentAnnouncement, setUrgentAnnouncement] =
    useState<UrgentAnnouncementType | null>(null);

  const [preview, _setPreview] = useState<AnnouncementRetrieveType | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<any>(null);

  const runUrgentAnnouncement = (data: UrgentAnnouncementType) => {
    setUrgentAnnouncement(data);
  };

  useEffect(() => {
    if (!urgentAnnouncement) return;

    const timeout = setTimeout(() => {
      setUrgentAnnouncement(null);
    }, convertDurationToSeconds(urgentAnnouncement.duration) * 1000 || 10000);

    return () => clearTimeout(timeout);
  }, [urgentAnnouncement]);

  const fetchAnnouncements = () => {
    let delay = 1000;

    const retryFetch = async () => {
      try {
        setIsLoading(true);
        const res_data = await listActiveAnnouncementApi();
        setAnnouncementList(res_data);

        setError(null);
        setIsReady(true);
      } catch (error) {
        setError(error);

        delay = Math.min(delay * 2, 30000);
        setTimeout(retryFetch, delay);
      } finally {
        setIsLoading(false);
      }
    };

    retryFetch(); // Start fetching immediately
  };

  const updateSequence = (data: { id: number; new_position: number }[]) => {
    setAnnouncementList((prev) =>
      sortItemsByPosition(structuredClone(prev), data)
    );
  };

  const _resortUpdatedItems = (
    arr: AnnouncementListType,
    newItem: AnnouncementRetrieveType
  ) => {
    const insertIndex = arr.findIndex(
      (item) => item.position >= newItem.position
    );

    if (insertIndex !== -1) {
      arr.splice(insertIndex, 0, newItem);
    } else {
      arr.push(newItem);
    }

    return arr;
  };

  const updateItem = (id: string, updatedData: AnnouncementRetrieveType) => {
    setAnnouncementList((prev) => {
      const index = prev.findIndex((item) => item.id === id);

      if (index === -1) {
        const updatedList = _resortUpdatedItems(prev, updatedData);
        return [...updatedList];
      } else {
        return prev.map((item) => (item.id == id ? updatedData : item));
      }
    });
  };

  const fetchAndInsertItem = async (id: string) => {
    try {
      const res_data = await retrieveTextAnnouncementApi(axios, id);

      insertItem(res_data);
    } catch (error) {}
  };

  const insertItem = (newItem: AnnouncementRetrieveType) => {
    setAnnouncementList((prev) => {
      const updatedList = _resortUpdatedItems(prev, newItem);

      return [...updatedList];
    });
  };

  const deleteItem = (id: string) => {
    if (announcementList.length === 1) {
      setIdOnLock("");
      setAnnouncementList([]);
      setMediaAnnouncements([]);
      setTextAnnouncements([]);
      setTextAnnouncementsAsText([]);
      return;
    }

    setTimeout(() => {
      setIdOnLock((currentLock) => {
        if (currentLock === id) {
          deleteItem(id);
        } else {
          setAnnouncementList((prev) => prev.filter((item) => item.id !== id));
        }
        return currentLock;
      });
    }, 3000);
  };

  useEffect(() => {
    if (!preview) return;

    if (preview.text_announcement) return;

    let duration: number = 1000;

    if (preview.image_announcement && preview.image_announcement.length > 0) {
      duration =
        convertDurationToSeconds(addTotalDuration(preview.image_announcement)) *
        1000;
    } else if (
      preview.video_announcement &&
      preview.video_announcement.length > 0
    ) {
      duration =
        convertDurationToSeconds(addTotalDuration(preview.video_announcement)) *
        1000;
    }

    const removePreview = setTimeout(() => {
      _setPreview(null);
    }, duration);

    return () => {
      clearTimeout(removePreview);
    };
  }, [preview]);

  const setDisplayPreview = (data: AnnouncementRetrieveType) => {
    _setPreview(data);
  };

  // Fetch
  // useEffect(() => {
  //   fetchAnnouncements();
  // }, []);

  // Copy to respective types
  useEffect(() => {
    if (announcementList.length === 0) return;
    const today = new Date();

    const filteredList = announcementList.filter(
      (announcement) =>
        new Date(announcement.end_date).getTime() > today.getTime() &&
        new Date(announcement.start_date).getTime() < today.getTime()
    );

    setMediaAnnouncements(
      structuredClone(
        filteredList.filter((announcement) => !announcement.text_announcement)
      )
    );

    setTextAnnouncements(
      structuredClone(
        filteredList.filter((announcement) => announcement.text_announcement)
      )
    );

    if (filteredList.length === 0) return;

    const earliestToexpire = filteredList.reduce((earliest, announcement) => {
      return new Date(announcement.end_date) < new Date(earliest.end_date)
        ? announcement
        : earliest;
    }, filteredList[0]);

    const duration =
      new Date(earliestToexpire.end_date).getTime() - today.getTime();

    setTimeout(() => {
      deleteItem(earliestToexpire.id);
    }, duration);
  }, [announcementList]);

  // Get string of text announcements
  useEffect(() => {
    if (textAnnouncements.length === 0) {
      setTextAnnouncementsAsText([]);
      return;
    }

    const texts: string[] = [];
    textAnnouncements.forEach((announcement) => {
      if (!announcement.text_announcement?.details) return;
      texts.push(
        extractReactQuillText(announcement.text_announcement.details as string)
      );
    });
    setTextAnnouncementsAsText(texts);
  }, [textAnnouncements]);

  const mediaDurations = mediaAnnouncements.map((announcement) => {
    if (
      announcement.image_announcement &&
      announcement.image_announcement.length > 0
    ) {
      return (
        convertDurationToSeconds(
          addTotalDuration(announcement.image_announcement)
        ) * 1000
      );
    } else if (
      announcement.video_announcement &&
      announcement.video_announcement.length > 0
    ) {
      return (
        convertDurationToSeconds(
          addTotalDuration(announcement.video_announcement)
        ) * 1000
      );
    } else {
      return 5000;
    }
  });

  return {
    fetchAnnouncements,
    announcementList,
    idOnLock,
    setIdOnLock,
    mediaAnnouncements,
    textAnnouncements,
    textAnnouncementsAsText,
    mediaDurations,
    urgentAnnouncement,
    preview,
    updateItem,
    insertItem,
    fetchAndInsertItem,
    deleteItem,
    updateSequence,
    setDisplayPreview,
    runUrgentAnnouncement,
    error,
    isLoading,
    isReady,
  };
};
export default useAnnouncementData;
