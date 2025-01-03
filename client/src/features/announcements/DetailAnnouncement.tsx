import "react-quill/dist/quill.snow.css";

import { type AnnouncementRetrieveType } from "../../types/AnnouncementTypes";
import DisplayQuillEditor from "../../components/DisplayQuillEditor";
import AuthorCard from "../../components/AuthorCard";
import { convertDurationToSeconds } from "../../utils/utils";
import ImageSlider from "../../components/ImageSlider";

type DetailAnnouncementProps = {
  data: AnnouncementRetrieveType;
};

const DetailAnnouncement = ({ data }: DetailAnnouncementProps) => {
  const { title, text_announcement } = data;

  const imageUrls = data.image_announcement?.map((image) => {
    return image.image;
  });
  const imageDurations = data.image_announcement?.map((image) => {
    return convertDurationToSeconds(image.duration as string) * 1000;
  });

  return (
    <div className="w-full pb-4">
      <div>
        <DisplayQuillEditor value={JSON.parse(title as string)} isTitle />
      </div>
      <div className="w-full m-auto md:w-4/5 lg:w-1/2 p-4 bg-white shadow-lg rounded-lg border border-gray-200 mt-2">
        <div>
          <AuthorCard
            image={data.author.profile.image}
            name={data.author.first_name + " " + data.author.last_name}
            role={data.author.profile.role}
            position={data.author.profile.position}
          />
        </div>
        <div>
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
              />
            )}
        </div>
      </div>
    </div>
  );
};
export default DetailAnnouncement;
