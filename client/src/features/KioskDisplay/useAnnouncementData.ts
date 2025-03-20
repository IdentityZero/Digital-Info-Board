import { useEffect, useState } from "react";

import { addTotalDuration, convertDurationToSeconds } from "../../utils/utils";
import { extractReactQuillText } from "../../utils/formatters";
import { AnnouncementListType } from "../../types/AnnouncementTypes";
import { listActiveAnnouncementApi } from "../../api/announcementRequest";

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

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  // const [isMediaLoading, setIsMediaLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res_data = await listActiveAnnouncementApi();
        setAnnouncementList(res_data);
        setMediaAnnouncements(
          structuredClone(
            res_data.filter((announcement) => !announcement.text_announcement)
          )
        );
        setTextAnnouncements(
          structuredClone(
            res_data.filter((announcement) => announcement.text_announcement)
          )
        );
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (textAnnouncements.length === 0) return;
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

  // // Prefetching Videos
  // useEffect(() => {
  //   if (mediaAnnouncements.length === 0 || !mediaAnnouncements) return;

  //   console.clear();
  //   mediaAnnouncements.forEach((announcement) => {
  //     if (
  //       announcement.video_announcement &&
  //       announcement.video_announcement.length > 0
  //     ) {
  //       announcement.video_announcement.forEach((announcement) => {
  //         fetch(announcement.video as string);
  //       });
  //     }
  //   });
  //   setIsMediaLoading(false);
  // }, [mediaAnnouncements]);

  return {
    announcementList,
    mediaAnnouncements,
    // isMediaLoading,
    textAnnouncements,
    isLoading,
    error,
    textAnnouncementsAsText,
    mediaDurations,
  };
};
export default useAnnouncementData;
