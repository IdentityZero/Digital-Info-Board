import { FaExclamationCircle } from "react-icons/fa";

import ClosableMessage from "../../../components/ClosableMessage";
import { CreateTextAnnouncement } from "../../../features/announcements";

const CreateTextContentPage = () => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <ClosableMessage
          className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-[#305ab3] font-bold"
          icon={FaExclamationCircle}
        >
          This is where you can manage the anouncement will be shown on the
          board.
        </ClosableMessage>
      </div>
      <div className="mt-2 flex flex-col gap-2">
        <h3 className="bg-cyanBlue px-5 py-3 mt-0 text-xl text-center">
          Announcements
        </h3>
        <div className="md:p-3">
          <CreateTextAnnouncement />
        </div>
      </div>
    </>
  );
};
export default CreateTextContentPage;
