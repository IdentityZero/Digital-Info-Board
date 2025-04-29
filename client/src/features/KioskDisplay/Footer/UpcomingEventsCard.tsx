import { memo } from "react";

import LoadingSpinner from "../../../components/LoadingSpinner";
import { formatInputDate } from "../../../utils/formatters";
import { UpcomingEventType } from "../../../types/FixedContentTypes";

type UpcomingEventsCardProps = {
  events: UpcomingEventType[];
  isLoading: boolean;
};

const UpcomingEventsCard = memo(
  ({ events, isLoading }: UpcomingEventsCardProps) => {
    return (
      <div className="relative flex flex-col items-center rounded-2xl shadow-lg h-full px-1 ">
        {/* Glowing Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-purple-500/30 rounded-2xl blur-2xl"></div>

        {/* Title */}
        <div className="text-3xl font-mono font-bold animate-pulse">
          Upcoming Events
        </div>

        {/* Divider */}
        <div className="w-5/6 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse my-2"></div>

        {/* Events List */}
        {isLoading ? (
          <>
            <div className="w-full flex flex-row items-center justify-center gap-2 mb-2">
              <LoadingSpinner size={48} />
              <p className={"font-medium text-white-600 animate-pulse text-lg"}>
                Loading...
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-4 z-10">
            {events.slice(0, 3).map((event, index) => (
              <div key={index} className="text-center">
                <div className="text-md font-bold tracking-wide">
                  {event.name}
                </div>
                <div className="text-md opacity-90">
                  {formatInputDate(event.date)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
export default UpcomingEventsCard;
