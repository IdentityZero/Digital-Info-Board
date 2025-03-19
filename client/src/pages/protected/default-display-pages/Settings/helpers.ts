// #region Topic: Slide show duration helpers

export type SlideShowDurationErrorType = {
  organization_slide_duration: string | string[];
  media_displays_slide_duration: string | string[];
};

export const slideShowDurationErrInitState: SlideShowDurationErrorType = {
  organization_slide_duration: "",
  media_displays_slide_duration: "",
};

// #endregion
