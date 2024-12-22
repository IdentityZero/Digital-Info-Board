import { FaExclamationCircle } from "react-icons/fa";

import ClosableMessage from "../../../components/ClosableMessage";
import { CreateImageAnnouncement } from "../../../features/announcements";

const CreateImageContentPage = () => {
  return (
    <>
      <div className="flex gap-2 flex-col">
        <ClosableMessage
          className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-[#305ab3] font-bold"
          icon={FaExclamationCircle}
        >
          This is where you can manage which images will be shown on the board.
        </ClosableMessage>
        <ClosableMessage
          className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-[#6e8ea4] font-bold"
          icon={FaExclamationCircle}
        >
          File type allowed JPG, JPEG, JFIF, PNG and GIF.
        </ClosableMessage>
      </div>
      <div className="mt-2">
        <h3 className="bg-[#ececec] px-5 py-3 text-xl font-bold">
          Banner images
        </h3>
        <div>
          <CreateImageAnnouncement />
        </div>
      </div>
    </>
  );
};
export default CreateImageContentPage;
