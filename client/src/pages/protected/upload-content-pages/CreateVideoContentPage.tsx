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
          This is where you can manage which videos will be shown on the board.
        </ClosableMessage>
        <ClosableMessage
          className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-[#f0d68d] font-bold"
          icon={FaExclamationCircle}
        >
          There is a mininum of only 5 videos uploaded at a time. File type
          allowed MP4, AVI and MOV.
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
