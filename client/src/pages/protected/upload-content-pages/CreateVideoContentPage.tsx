import ClosableMessage from "../../../components/ClosableMessage";

import { FaExclamationCircle } from "react-icons/fa";
import { CreateVideoAnnouncement } from "../../../features/announcements";

const CreateVideoContentPage = () => {
  return (
    <>
      <div className="flex gap-2 flex-col">
        <ClosableMessage
          className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-[#f0d68d] font-bold"
          icon={FaExclamationCircle}
        >
          Max of 5 videos at a time. Each video should not exceed 200MB.
        </ClosableMessage>
        <ClosableMessage
          className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-[#f0d68d] font-bold"
          icon={FaExclamationCircle}
        >
          Supported file formats: .mp4, .webm, .ogg, .m4v, .mov (Note that other
          mp4 codecs may not work properly.)
        </ClosableMessage>
      </div>
      <div className="mt-2">
        <h3 className="bg-[#ececec] px-5 py-3 text-xl font-bold">
          Banner videos
        </h3>
        <div className="md:p-3">
          <CreateVideoAnnouncement />
        </div>
      </div>
    </>
  );
};
export default CreateVideoContentPage;
