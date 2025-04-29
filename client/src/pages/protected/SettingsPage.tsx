import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";

import ClosableMessage from "../../components/ClosableMessage";

import useWebsocket from "../../hooks/useWebsocket";

import { FIELD_DEVICES_URL } from "../../constants/urls";

type WsMessageType = {
  type: "connection_established" | "rpi_is_on";
  message: string;
};

type ButtonTypes = "refresh" | "restart" | "shutdown";

const SettingsPage = () => {
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);

  const { sendMessage, isConnectionOpen } = useWebsocket(
    FIELD_DEVICES_URL,
    handleOnWsMessage
  );

  useEffect(() => {
    if (!isConnectionOpen) {
      setIsDeviceConnected;
    }
  }, [isConnectionOpen]);

  function handleOnWsMessage(data: WsMessageType) {
    if (data.type === "connection_established") {
      sendMessage({ type: "ask_rpi_on", message: "Is Raspberry Pi on?" });
    } else if (data.type === "rpi_is_on") {
      setIsDeviceConnected(true);
    }
  }

  const handleRetryDeviceConnection = () => {
    sendMessage({ type: "ask_rpi_on", message: "Is Raspberry Pi on?" });
  };

  const handleButtonClick = (type: ButtonTypes) => {
    const conf = window.confirm(`Are you sure you want to ${type} the RPI?`);

    if (!conf) return;

    if (type === "shutdown") {
      sendMessage({ type: "shutdown_rpi", message: "shutdown_rpi" });
    } else if (type === "restart") {
      sendMessage({ type: "restart_rpi", message: "restart_rpi" });
    } else if (type === "refresh") {
      sendMessage({ type: "refresh_rpi", message: "refresh_rpi" });
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col gap-8 items-center ">
      <div className="space-y-2 w-full">
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
      </div>
      <div className="w-full flex-1 space-y-8">
        <div className="bg-white border border-black w-full md:w-2/3 lg:w-1/2 mx-auto">
          <h2 className="w-full bg-cyanBlue p-3 font-bold text-center">
            Main Control
          </h2>

          {/* Status Indicators */}
          <div className="flex justify-between px-5 pt-5 text-sm font-medium">
            {/* User to Server */}
            <div className="flex items-center space-x-2">
              {isConnectionOpen ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaTimesCircle className="text-red-500" />
              )}
              <span>User Connection</span>
            </div>

            {/* Server to RPI */}
            <div className="flex items-center space-x-2">
              {isDeviceConnected && isConnectionOpen ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaTimesCircle className="text-red-500" />
              )}
              <span>RPI Connection</span>
            </div>
          </div>

          {/* Retry Button */}
          {(!isDeviceConnected || !isConnectionOpen) && (
            <div className="flex justify-end px-5 mt-2">
              <button
                onClick={handleRetryDeviceConnection}
                className="text-sm text-blue-600 hover:underline"
              >
                Retry RPI Connection
              </button>
            </div>
          )}

          {/* Shutdown Button */}
          <div className="w-full flex flex-wrap gap-4 p-5 justify-center">
            <button
              className="text-center py-3 px-8 bg-btPrimary hover:bg-btPrimary-hover active:bg-btPrimary-active rounded-full uppercase font-bold flex-1 min-w-[150px] sm:flex-none"
              onClick={() => handleButtonClick("refresh")}
            >
              Refresh
            </button>
            <button
              className="text-center py-3 px-8 bg-btSecondary hover:bg-btSecondary-hover active:bg-btSecondary-active rounded-full uppercase font-bold flex-1 min-w-[150px] sm:flex-none"
              onClick={() => handleButtonClick("restart")}
            >
              Restart
            </button>
            <button
              className="text-center py-3 px-8 bg-btDanger hover:bg-btDanger-hover active:bg-btDanger-active rounded-full uppercase font-bold flex-1 min-w-[150px] sm:flex-none"
              onClick={() => handleButtonClick("shutdown")}
            >
              Shutdown
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-sm mb-8">
        Copyright @ CpE Digital Infoboard Portal 2025
      </div>
    </div>
  );
};
export default SettingsPage;
