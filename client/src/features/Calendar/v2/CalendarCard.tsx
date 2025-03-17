type CalendarCardProps = {
  title: string;
  time: string;
  location?: string;
  description?: string;
};

const CalendarCard = ({
  title,
  time,
  location,
  description,
}: CalendarCardProps) => {
  return (
    <div className="w-full h-full overflow-auto calendar-scrollbar">
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
