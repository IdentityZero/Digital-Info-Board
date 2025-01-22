import { FaExclamationCircle } from "react-icons/fa";
import ClosableMessage from "../../components/ClosableMessage";

const CalendarPage = () => {
  return (
    <div>
      <ClosableMessage
        className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-[#305ab3] font-bold"
        icon={FaExclamationCircle}
      >
        Update school calendar with list of events, holidays and activities
      </ClosableMessage>
    </div>
  );
};
export default CalendarPage;
