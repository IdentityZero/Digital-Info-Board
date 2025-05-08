import { FaExclamationCircle } from "react-icons/fa";

import ClosableMessage from "../../../components/ClosableMessage";
import { CreateImageAnnouncement } from "../../../features/announcements";

const CreateImageContentPage = () => {
  return (
    <>
      <div className="flex gap-2 flex-col">
        <ClosableMessage
          className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-[#6e8ea4] font-bold"
          icon={FaExclamationCircle}
        >
          Each image should not exceed 10MB.
        </ClosableMessage>
        <ClosableMessage
          className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-[#6e8ea4] font-bold"
          icon={FaExclamationCircle}
        >
          Supported file formats: .jpg, .jpeg, .png, .jfif, .gif, .webp, .avif
        </ClosableMessage>
      </div>
      <div className="mt-2">
        <h3 className="bg-[#ececec] px-5 py-3 text-xl font-bold">
          Banner images
        </h3>
        <div className="md:p-3">
          <CreateImageAnnouncement />
        </div>
      </div>
    </>
  );
};
export default CreateImageContentPage;
