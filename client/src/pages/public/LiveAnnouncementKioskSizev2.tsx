import logoLg from "../../assets/logo-lg.png";
import NewsTicker from "../../components/NewsTicker";

const LiveAnnouncementKioskSizeV2 = () => {
  const isPortrait = true;

  return (
    <div className="w-full h-screen bg-[#1b0b7c] flex flex-col gap-1">
      {/* Title */}
      <div className="h-[10.94%] w-full flex items-center justify-center text-white text-7xl font-bold">
        Title
      </div>

      {/* Main Content */}
      <div
        className={`h-[59.38%] w-full flex flex-row ${
          isPortrait ? "flex-row" : "flex-col"
        } p-2 gap-2`}
      >
        {/* Content */}
        <div
          className={`${
            isPortrait ? "w-[65.28%] h-full" : "w-full h-[60%]"
          }  bg-gray-400 flex items-center justify-center text-white text-lg border-8`}
        >
          <img
            src="https://picsum.photos/200/300?random=1"
            className="h-full w-full"
            alt="Image"
          />
        </div>

        {/* Faculty Calendar Container */}
        <div
          className={`${
            isPortrait
              ? "basis-[34.72%] h-full flex-col"
              : "w-full h-[39%] flex-row"
          } flex gap-2`}
        >
          {/* Faculties and Org */}
          <div
            className={`${
              isPortrait ? "basis-1/2 w-full" : "h-full basis-1/3"
            } relative  bg-white flex items-center justify-center text-gray-800 text-md border-4 py-2 `}
          >
            <img src={logoLg} alt="logo" className="absolute opacity-5" />
            <div className="z-[1] h-full w-full flex flex-col">
              <p className="text-center font-bold text-xl">CPE Department</p>
              <div className="flex-1 flex flex-col justify-evenly">
                <OrgCard />
                <OrgCard />
                <OrgCard />
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div
            className={`${
              isPortrait ? "basis-1/2 w-full" : "h-full basis-1/3"
            } bg-white flex items-center justify-center text-gray-800 text-md border-4`}
          >
            <iframe
              src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FManila&showPrint=0&showTz=0&showTitle=0&showNav=0&showTabs=0&src=ZjE5NmZkNjhmNTM4NTk2NTQzOWI1ODk2MmM0OGY3N2RjMzRmNjY5ZTZiOTI4ZmMwMjZlNTMzYjg4YmMyNjhjYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%237CB342"
              style={{ border: "0", height: "100%", width: "100%" }}
            ></iframe>
          </div>
          {!isPortrait && (
            <div className="h-full basis-1/3 border-4">
              <img
                src="https://picsum.photos/200/300?random=1"
                className="h-full w-full object-fill"
                alt="Image"
              />
            </div>
          )}
        </div>
      </div>

      {/* News Ticker */}
      <div className="h-[5%] flex flex-col justify-center text-black">
        <div className="bg-white w-fit p-1 relative overflow-hidden">
          <p className="pl-8 px-4 uppercase font-semibold text-sm tracking-wide">
            News Update
          </p>
          <div className="absolute left-0 bottom-0 h-[2px] bg-blue-500 animate-dynamic-slide"></div>
        </div>
        <NewsTicker
          headlines={[
            "NEW COLLECTION",
            "NEW COLLECTION",
            "NEW COLLECTION",
            "NEW COLLECTION",
          ]}
          className="bg-[#0073C5] p-1 font-bold text-2xl text-[#F8E94E]"
        />
      </div>

      {/* Default Displays */}
      <div className="h-[22.68%] w-full flex flex-row gap-1 p-2 text-white text-md">
        <div className="flex-1 bg-green-600 flex items-center justify-center border-4">
          <img
            src="https://image1.slideserve.com/1849726/single-day-weather-report-l.jpg"
            className="h-full w-full "
            alt="Image"
          />
        </div>
        <div className="flex-1 bg-black flex flex-col items-center justify-center border-4">
          <p className="text-6xl font-semibold">12:12:12</p>
          <p className="text-4xl font-semibold mt-4">Thursday</p>
          <p className="text-4xl font-semibold">2025/03/30</p>
        </div>
        <div className="flex-1 bg-green-800 flex items-center justify-center border-4">
          <img
            src="https://picsum.photos/200/300?random=2"
            className="h-full w-full object-fill"
            alt="Image"
          />
        </div>
      </div>

      {/* Footer  */}
      <div className="h-[2%] w-full flex items-center justify-center text-white text-sm p-0.5 mb-1 lowercase">
        Powered by Computer Engineering Students
      </div>
    </div>
  );
};
export default LiveAnnouncementKioskSizeV2;

function OrgCard() {
  return (
    <div>
      <div className="flex items-center space-x-2 p-4">
        <img
          className="w-16 h-16 rounded-full object-cover"
          src="https://picsum.photos/150/150?random=1"
          alt="TODO:NAME"
        />
        <div className="flex flex-col items-center bg-[#2f6dc1] w-full rounded-full text-white py-1">
          <span className="text-sm font-semibold">Engr. Juan Dela Cruz</span>
          <span className="text-xs">Position</span>
        </div>
      </div>
    </div>
  );
}
