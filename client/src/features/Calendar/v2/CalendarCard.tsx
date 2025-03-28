type CalendarCardProps = {
  title: string;
  time: string;
  location?: string;
  description?: string;
  isHighlighted?: boolean;
};

const CalendarCard = ({
  title,
  time,
  location,
  description,
  isHighlighted = false,
}: CalendarCardProps) => {
  return (
    <div
      className={`w-full h-full overflow-x-hidden calendar-scrollbar max-w-[200px] cursor-pointer p-2 rounded-lg transition-shadow duration-300 ${
        isHighlighted ? "shadow-[0_0_15px_#FFD700]" : ""
      }`}
    >
      <p>
        <b>{time}</b> &nbsp; <i>{title}</i>
      </p>
      <p>
        📍 <i>{location || "Location unspecified"}</i>
      </p>
      <p>
        ℹ️ <i>{description || "No description"}</i>
      </p>
    </div>
  );
};
export default CalendarCard;
