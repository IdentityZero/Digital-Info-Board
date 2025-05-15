import { FaExclamationCircle } from "react-icons/fa";

import ClosableMessage from "../../../components/ClosableMessage";

import CreateUrgentAnnouncement from "../../../features/announcements/CreateAnnouncement/CreateUrgentAnnouncement";

import { useAuth } from "../../../context/AuthProvider";

const CreateUrgentContentPage = () => {
  const { user } = useAuth();
  return (
    <>
      <div className="flex flex-col gap-2">
        <ClosableMessage
          className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-cyanBlue font-bold"
          icon={FaExclamationCircle}
        >
          This kind of announcement will only show in KIOSK Display.
        </ClosableMessage>
        {!user?.is_admin && (
          <ClosableMessage
            className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-btDanger font-bold"
            icon={FaExclamationCircle}
          >
            This Announcement does not require approval and automatically shows
            in the Display. Be careful when using it.
          </ClosableMessage>
        )}
      </div>
      <div className="md:p-3">
        <CreateUrgentAnnouncement />
      </div>
    </>
  );
};
export default CreateUrgentContentPage;
