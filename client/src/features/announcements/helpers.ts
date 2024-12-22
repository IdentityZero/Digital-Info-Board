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
