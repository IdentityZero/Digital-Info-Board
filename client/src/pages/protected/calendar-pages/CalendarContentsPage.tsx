import { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";

import ClosableMessage from "../../../components/ClosableMessage";
import LoadingMessage from "../../../components/LoadingMessage";

import CreateCalendarEvent from "../../../features/Calendar/CreateCalendarEvent";

const CalendarContentsPage = () => {
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  return (
    <div>
      <div className="flex flex-col gap-2">
        <ClosableMessage
          className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-[#305ab3] font-bold"
          icon={FaExclamationCircle}
        >
          Update school calendar with list of events, holidays and activities
        </ClosableMessage>
        <ClosableMessage
          className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-[#305ab3] font-bold"
          icon={FaExclamationCircle}
        >
          Cannot delete as of now.
        </ClosableMessage>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 mt-4">
        <section>
          {isCalendarLoading && (
            <LoadingMessage message="Loading calendar..." />
          )}
          <iframe
            src="https://calendar.google.com/calendar/embed?src=f196fd68f5385965439b58962c48f77dc34f669e6b928fc026e533b88bc268cb%40group.calendar.google.com&ctz=Asia%2FManila"
            style={{
              border: "0",
              width: "100%",
              height: "600px",
              overflow: " hidden",
            }}
            onLoad={() => {
              setIsCalendarLoading(false);
            }}
          ></iframe>
        </section>
        <section className="w-full px-4">
          <CreateCalendarEvent />
        </section>
      </div>
    </div>
  );
};
export default CalendarContentsPage;
