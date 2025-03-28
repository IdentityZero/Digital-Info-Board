import { FaExclamationCircle } from "react-icons/fa";
import ClosableMessage from "../../components/ClosableMessage";
import { useEffect, useState } from "react";
import { FIELD_DEVICES_URL } from "../../constants/urls";

const SettingsPage = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(FIELD_DEVICES_URL);
    setSocket(ws);
  }, []);

  const handleShutdown = () => {
    const shutdownConf = window.confirm(
      "Are you sure you want to shutdown the RPI?"
    );

    if (!shutdownConf) return;
    socket?.send(
      JSON.stringify({ type: "shutdown_rpi", message: "shutdown_rpi" })
    );
  };

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
          <button
            className="text-center py-3 px-10 bg-btDanger rounded-full uppercase font-bold"
            onClick={handleShutdown}
          >
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
