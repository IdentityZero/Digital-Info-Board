import DisplayQuillEditor from "../../components/DisplayQuillEditor";
import ImageSlider from "../../components/ImageSlider";
import VideoSlider from "../../components/VideoSlider";
import { AnnouncementRetrieveType } from "../../types/AnnouncementTypes";
import { convertDurationToSeconds } from "../../utils/utils";

type KMAnnouncementDetailProps = {
  announcement: AnnouncementRetrieveType;
  play?: boolean;
};

const KMAnnouncementDetail = ({
  announcement,
  play = false,
}: KMAnnouncementDetailProps) => {
  const imageUrls = announcement.image_announcement?.map((image) => {
    return image.image;
  });
  const imageDurations = announcement.image_announcement?.map((image) => {
    return convertDurationToSeconds(image.duration as string) * 1000;
  });

  const videoUrls = announcement.video_announcement?.map((video) => {
    return video.video;
  });

  const videoDurations = announcement.video_announcement?.map((video) => {
    return convertDurationToSeconds(video.duration as string) * 1000;
  });

  return (
    <div className="h-full w-full flex flex-col">
      <div className="h-[20%] flex items-center justify-center bg-[#2A6AAA]">
        <DisplayQuillEditor
          value={JSON.parse(announcement.title as string)}
          isTitle
        />
      </div>
      <div className="h-[80%] mt-4 overflow-auto">
        {announcement.text_announcement && (
          <DisplayQuillEditor
            withBackground={false}
            value={JSON.parse(
              announcement.text_announcement?.details as string
            )}
            className="p-4"
          />
        )}
        {imageUrls &&
          imageDurations &&
          announcement.image_announcement &&
          announcement.image_announcement?.length > 0 && (
            <div className="w-full h-full">
              <ImageSlider
                images={imageUrls as string[]}
                durations={imageDurations as number[]}
                showDuration={false}
                showArrows={false}
                reset={play}
              />
            </div>
          )}
        {videoUrls &&
          videoDurations &&
          announcement.video_announcement &&
          announcement.video_announcement?.length > 0 && (
            <div className="h-full w-full">
              <VideoSlider
                videos={videoUrls as string[]}
                durations={videoDurations as number[]}
                showDuration={false}
                showArrows={false}
                stop={!play}
              />
            </div>
          )}
      </div>
    </div>
  );
};
export default KMAnnouncementDetail;
