import { useEffect, useState } from "react";
import { AnnouncementListType } from "../../../types/AnnouncementTypes";
import { listActiveAnnouncementApi } from "../../../api/announcementRequest";
import {
  addTotalDuration,
  convertDurationToSeconds,
} from "../../../utils/utils";

const useAnnouncementSlider = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementListType>([]);
  const [sliderItems, setSliderItems] = useState<AnnouncementListType>([]);
  const [sliderItemsForEdit, setSliderItemsForEdit] =
    useState<AnnouncementListType>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const extendedAnnouncements = [
    announcements[announcements?.length - 1],
    ...announcements,
    announcements[0],
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res_data = await listActiveAnnouncementApi();
        setAnnouncements(res_data);
        setSliderItems(structuredClone(res_data));
        setSliderItemsForEdit(structuredClone(res_data));
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const durations = announcements.map((announcement) => {
    if (announcement.text_announcement) {
      return (
        convertDurationToSeconds(
          announcement.text_announcement.duration as string
        ) * 1000
      );
    } else if (
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

  const extendedDurations = [
    durations[announcements.length - 1],
    ...durations,
    durations[0],
  ];

  return {
    announcements,
    setAnnouncements,
    sliderItems,
    setSliderItems,
    sliderItemsForEdit,
    setSliderItemsForEdit,
    extendedAnnouncements,
    isLoading,
    error,
    durations,
    extendedDurations,
  };
};
export default useAnnouncementSlider;
