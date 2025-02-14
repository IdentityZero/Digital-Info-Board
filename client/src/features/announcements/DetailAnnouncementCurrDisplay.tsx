/**
 * UNUSED
 */

import AuthorCard from "../../components/AuthorCard";
import DisplayQuillEditor from "../../components/DisplayQuillEditor";
import ImageSlider from "../../components/ImageSlider";
import VideoSlider from "../../components/VideoSlider";
import { type AnnouncementRetrieveType } from "../../types/AnnouncementTypes";
import { convertDurationToSeconds } from "../../utils/utils";

type DetailAnnouncementCurrDisplayProps = {
  data: AnnouncementRetrieveType;
  stopVideo: boolean;
  reset: boolean;
};

const DetailAnnouncementCurrDisplay = ({
  data,
  stopVideo,
  reset,
}: DetailAnnouncementCurrDisplayProps) => {
  const { text_announcement } = data;

  const imageUrls = data.image_announcement?.map((image) => {
    return image.image;
  });
  const imageDurations = data.image_announcement?.map((image) => {
    return convertDurationToSeconds(image.duration as string) * 1000;
  });

  const videoUrls = data.video_announcement?.map((video) => {
    return video.video;
  });

  const videoDurations = data.video_announcement?.map((video) => {
    return convertDurationToSeconds(video.duration as string) * 1000;
  });
  return (
    <div className="h-full flex flex-col justify-between mx-auto w-[90%] bg-white shadow-lg rounded-lg border border-gray-200">
      <AuthorCard
        image={data.author.profile.image}
        name={data.author.first_name + " " + data.author.last_name}
        role={data.author.profile.role}
        position={data.author.profile.position}
      />
      <div className="flex items-center h-full">
        {data.text_announcement && (
          <DisplayQuillEditor
            value={JSON.parse(text_announcement?.details as string)}
            className="h-[400px] max-xl:h-[250px]"
          />
        )}
        {imageUrls &&
          imageDurations &&
          data.image_announcement &&
          data.image_announcement?.length > 0 && (
            <div className="h-[400px] max-xl:h-[250px] w-full">
              <ImageSlider
                images={imageUrls as string[]}
                durations={imageDurations as number[]}
                showDuration={false}
                showArrows={false}
                reset={reset}
              />
            </div>
          )}
        {videoUrls &&
          videoDurations &&
          data.video_announcement &&
          data.video_announcement?.length > 0 && (
            <div className="h-[400px] max-xl:h-[250px] w-full">
              <VideoSlider
                videos={videoUrls as string[]}
                durations={videoDurations as number[]}
                showDuration={false}
                showArrows={false}
                stop={stopVideo}
              />
            </div>
          )}
      </div>
    </div>
  );
};
export default DetailAnnouncementCurrDisplay;
