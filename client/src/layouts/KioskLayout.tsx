import { Outlet } from "react-router-dom";
import { RealtimeUpdateProvider } from "../context/RealtimeUpdate";

const KioskLayout = () => {
  return (
    <RealtimeUpdateProvider>
      <Outlet />
    </RealtimeUpdateProvider>
  );
};
export default KioskLayout;
