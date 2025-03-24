import { useRef } from "react";

import AuthorCard from "../../components/AuthorCard";
import DisplayQuillEditor from "../../components/DisplayQuillEditor";
import ImageSlider from "../../components/ImageSlider";
import VideoSlider from "../../components/VideoSlider";

import { convertDurationToSeconds } from "../../utils/utils";

import { AnnouncementRetrieveType } from "../../types/AnnouncementTypes";

type AnnouncementThumbnailProps = {
  data: AnnouncementRetrieveType;
  onClick?: (data: AnnouncementRetrieveType) => void;
};

const AnnouncementThumbnail = ({
  data,
  onClick,
}: AnnouncementThumbnailProps) => {
  const container = useRef(null);
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
    <div
      className="w-[500px] h-[500px] bg-white shadow-lg rounded-lg border border-gray-200 mt-2 scale-[0.25] origin-top-left hover:!cursor-pointer"
      onClick={() => onClick && onClick(data)}
    >
      <div className="h-fit">
        <AuthorCard
          image={data.author.profile.image}
          name={data.author.first_name + " " + data.author.last_name}
          role={data.author.profile.role}
          position={data.author.profile.position}
        />
      </div>
      <div ref={container} className="h-[300px]">
        {data.text_announcement && (
          <DisplayQuillEditor
            value={JSON.parse(text_announcement?.details as string)}
          />
        )}

        {imageUrls &&
          imageDurations &&
          data.image_announcement &&
          data.image_announcement?.length > 0 && (
            <ImageSlider
              images={imageUrls as string[]}
              durations={imageDurations as number[]}
              showDuration={false}
              showArrows={false}
              play={false}
            />
          )}
        {videoUrls &&
          videoDurations &&
          data.video_announcement &&
          data.video_announcement?.length > 0 && (
            <VideoSlider
              videos={videoUrls as string[]}
              durations={videoDurations as number[]}
              showDuration={false}
              showArrows={false}
              stop={true}
              crossOrigin="anonymous"
              showControls={false}
            />
          )}
      </div>
    </div>
  );
};
export default AnnouncementThumbnail;
