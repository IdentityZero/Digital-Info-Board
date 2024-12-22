import { FaExclamationCircle } from "react-icons/fa";
import ClosableMessage from "../../components/ClosableMessage";

const SettingsPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col gap-8 items-center justify-center">
      <ClosableMessage
        className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-[#305ab3] font-bold"
        icon={FaExclamationCircle}
      >
        You can shutdown or restart rpi for bulletin board and portal
      </ClosableMessage>
      <ClosableMessage
        className="w-full flex flex-row items-center justify-between pr-5 p-2 bg-[#305ab3] font-bold"
        icon={FaExclamationCircle}
      >
        Shut down bulletin before portal
      </ClosableMessage>
      <div className="bg-white border border-black w-full">
        <h2 className="w-full bg-cyanBlue p-3 font-bold text-center">
          Main Control
        </h2>
        <div className="w-full flex p-5 justify-center">
          <button className="text-center py-3 px-10 bg-btDanger rounded-full uppercase font-bold">
            Shutdown
          </button>
        </div>
      </div>
      <div className="bg-white border border-black w-full">
        <h2 className="w-full bg-cyanBlue p-3 font-bold text-center">
          Individual Modules
        </h2>
        <div className="w-full flex p-5 justify-center">
          <button className="text-center py-3 px-10 bg-cyanBlue rounded-full uppercase font-bold">
            Control Options
          </button>
        </div>
      </div>
      <div>Copyright @ CpE Digital Infoboard Portal 2025</div>
    </div>
  );
};
export default SettingsPage;
