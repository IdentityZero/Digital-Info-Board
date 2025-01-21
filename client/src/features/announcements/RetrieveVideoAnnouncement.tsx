import DisplayQuillEditor from "../../components/DisplayQuillEditor";
import VideoSlider from "../../components/VideoSlider";
import { FullVideoAnnouncementType } from "../../types/AnnouncementTypes";
import { formatTimestamp } from "../../utils";
import { addTotalDuration, convertDurationToSeconds } from "../../utils/utils";

const RetrieveVideoAnnouncement = ({
  videoAnnouncementData,
  stopSlider,
}: {
  videoAnnouncementData: FullVideoAnnouncementType;
  stopSlider: boolean;
}) => {
  const videoUrls = videoAnnouncementData.video_announcement.map((video) => {
    return video.video;
  });

  const videoDurations: number[] = videoAnnouncementData.video_announcement.map(
    (video) => {
      return convertDurationToSeconds(video.duration as string) * 1000;
    }
  );

  return (
    <div className="mt-2 flex flex-col gap-2">
      <DisplayQuillEditor
        isTitle
        value={JSON.parse(videoAnnouncementData?.title as string)}
      />
      <div>
        <div className="w-1/2 h-[400px] mx-auto">
          <VideoSlider
            videos={videoUrls as string[]}
            durations={videoDurations}
            stop={stopSlider}
          />
        </div>
        <ContentInfoContainer data={videoAnnouncementData} />
      </div>
    </div>
  );
};

function ContentInfoContainer({ data }: { data: FullVideoAnnouncementType }) {
  return (
    <div className="bg-white w-full shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Related Information
        </h3>
        <p className="mt-1 w-full text-sm text-gray-500">
          Details and informations about author and announcement.
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Author Image</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <img
                className="h-16 w-16 rounded-full object-cover"
                src={`${data.author.profile.image}`}
                alt="Author"
              />
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Author Name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
              {data.author.first_name + " " + data.author.last_name}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Author Role - Position
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
              {data.author.profile.role + " - " + data.author.profile.position}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Display dates (start - end)
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {formatTimestamp(data.start_date) +
                " - " +
                formatTimestamp(data.end_date)}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Duration</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {/* {data.text_announcement.duration} */}
              {data.video_announcement &&
                addTotalDuration(data.video_announcement)}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Last Modified</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {formatTimestamp(data.last_modified)}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Created at</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {formatTimestamp(data.created_at)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
export default RetrieveVideoAnnouncement;
