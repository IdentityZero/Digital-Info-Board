const CalendarDisplay = () => {
  return (
    <div className="w-full h-full">
      <iframe
        className="w-full h-full border-0"
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FManila&showPrint=0&showTz=0&showTitle=0&showNav=0&showTabs=0&src=ZjE5NmZkNjhmNTM4NTk2NTQzOWI1ODk2MmM0OGY3N2RjMzRmNjY5ZTZiOTI4ZmMwMjZlNTMzYjg4YmMyNjhjYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%237CB342&mode=MONTH"
      ></iframe>
    </div>
  );
};
export default CalendarDisplay;
