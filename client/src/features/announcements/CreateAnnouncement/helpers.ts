import {
  ImageAnnouncementCreateType,
  VideoAnnouncementCreateType,
} from "../../../types/AnnouncementTypes";

export const isDuplicated = (
  media: ImageAnnouncementCreateType[] | VideoAnnouncementCreateType[],
  newMedia: File
): boolean => {
  if (media.length === 0) {
    return false;
  }

  const isImageArray = "image" in media[0];

  if (isImageArray) {
    return (media as ImageAnnouncementCreateType[]).some((medium) => {
      return (
        medium.image instanceof File &&
        medium.image.name === newMedia.name &&
        medium.image.size === newMedia.size
      );
    });
  } else {
    return (media as VideoAnnouncementCreateType[]).some((medium) => {
      return (
        medium.video instanceof File &&
        medium.video.name === newMedia.name &&
        medium.video.size === newMedia.size
      );
    });
  }
};
