import { MdOutlineCampaign } from "react-icons/md";

const NoAnnouncementCard = () => {
  return (
    <div className="flex gap-2 items-center justify-center ">
      <MdOutlineCampaign className="w-12 h-12" />
      <p className="text-xl font-semibold">There are no announcements</p>
    </div>
  );
};
export default NoAnnouncementCard;
