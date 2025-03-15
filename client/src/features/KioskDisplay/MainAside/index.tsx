import { memo } from "react";
import OrgMembers from "./OrgMembers";
import MediaDisplay from "../MediaDisplay";

const MainAside = memo(({ isPortrait }: { isPortrait: boolean }) => {
  return (
    <div
      className={`${
        isPortrait ? "flex-col gap-2" : "flex flex-row gap-1 p-2 justify-center"
      } flex w-full h-full`}
    >
      {/* Org Members */}
      <div
        className={`${
          isPortrait ? "w-full h-1/2" : "h-full w-1/3"
        } bg-white  backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden `}
      >
        <OrgMembers />
      </div>

      {/* Calendar */}
      <div
        className={`${
          isPortrait ? "w-full h-1/2" : "h-full w-1/3"
        } bg-white flex items-center justify-center text-gray-800 text-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden`}
      >
        <iframe
          className="w-full h-full border-0"
          src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FManila&showPrint=0&showTz=0&showTitle=0&showNav=0&showTabs=0&src=ZjE5NmZkNjhmNTM4NTk2NTQzOWI1ODk2MmM0OGY3N2RjMzRmNjY5ZTZiOTI4ZmMwMjZlNTMzYjg4YmMyNjhjYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%237CB342&mode=MONTH"
        ></iframe>
      </div>

      {/* Facts */}
      <div
        className={`${
          isPortrait ? "w-0 h-0" : "h-full w-1/3"
        } bg-white flex items-center justify-center text-gray-800 text-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden`}
      >
        <MediaDisplay initialIndex={2} />
      </div>
    </div>
  );
});

export default MainAside;
