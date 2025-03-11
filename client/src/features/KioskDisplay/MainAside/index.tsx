import { memo } from "react";
import OrgMembers from "./OrgMembers";

const MainAside = memo(({ isPortrait }: { isPortrait: boolean }) => {
  return (
    <>
      {/* Org Members */}
      <div
        className={`${
          isPortrait ? "basis-1/2 w-full h-1/2" : "h-full w-[360px]"
        } bg-white  backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden `}
      >
        <OrgMembers />
      </div>

      {/* Calendar */}
      <div
        className={`${
          isPortrait ? "basis-1/2 w-full" : "h-full w-[360px]"
        } bg-white flex items-center justify-center text-gray-800 text-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden`}
      >
        <iframe
          src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FManila&showPrint=0&showTz=0&showTitle=0&showNav=0&showTabs=0&src=ZjE5NmZkNjhmNTM4NTk2NTQzOWI1ODk2MmM0OGY3N2RjMzRmNjY5ZTZiOTI4ZmMwMjZlNTMzYjg4YmMyNjhjYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%237CB342&mode=AGENDA"
          style={{ border: "0", height: "100%", width: "100%" }}
        ></iframe>

        {/* Facts */}
      </div>
      {!isPortrait && (
        <div className="h-full w-[360px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <img
            src="https://picsum.photos/200/300?random=1"
            className="h-full w-full object-fill"
            alt="Image"
          />
        </div>
      )}
    </>
  );
});

export default MainAside;
