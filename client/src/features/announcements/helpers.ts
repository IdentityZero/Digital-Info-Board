// For Creating

export type TextAnnouncementErrorT = {
  title: string | string[];
  start_date: string | string[];
  end_date: string | string[];
  text_announcement: {
    details: string | string[];
    duration: string | string[];
  };
};

export const textAnnouncementErrorState: TextAnnouncementErrorT = {
  title: "",
  start_date: "",
  end_date: "",
  text_announcement: {
    details: "",
    duration: "",
  },
};

type BareImageAnnouncementErrorT = {
  image: string | string[];
  duration: string | string[];
};

export type ImageAnnouncementErrorT = {
  title: string | string[];
  start_date: string | string[];
  end_date: string | string[];
  image_announcement: BareImageAnnouncementErrorT[] | [];
};

export const CreateImageAnnouncementErrorState: ImageAnnouncementErrorT = {
  title: "",
  start_date: "",
  end_date: "",
  image_announcement: [],
};

type BareVideoAnnouncementErrorT = {
  video: string | string[];
  duration: string | string[];
};

export type VideoAnnouncementErrorT = {
  title: string | string[];
  start_date: string | string[];
  end_date: string | string[];
  video_announcement: BareVideoAnnouncementErrorT[] | [];
};

export const CreateVideoAnnouncementErrorState: VideoAnnouncementErrorT = {
  title: "",
  start_date: "",
  end_date: "",
  video_announcement: [],
};

// For Updating

type ToUpdateErrorT = {
  duration: string | string[];
};

export type UpdateImageAnnouncementErrorT = ImageAnnouncementErrorT & {
  to_update: ToUpdateErrorT[];
};

export const UpdateImageAnnouncementErrorState: UpdateImageAnnouncementErrorT =
  {
    title: "",
    start_date: "",
    end_date: "",
    image_announcement: [],
    to_update: [],
  };

export type UpdateVideoAnnouncementErrorT = VideoAnnouncementErrorT & {
  to_update: ToUpdateErrorT[];
};

export const UpdateVideoAnnouncementErrorState: UpdateVideoAnnouncementErrorT =
  {
    title: "",
    start_date: "",
    end_date: "",
    video_announcement: [],
    to_update: [],
  };
