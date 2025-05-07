import { Outlet } from "react-router-dom";
import { RealtimeUpdateProvider } from "../context/RealtimeUpdate";
import { Suspense } from "react";

import LoadingLazyComponent from "../components/LoadingLazyComponent";

const KioskLayout = () => {
  return (
    <RealtimeUpdateProvider>
      <Suspense fallback={<LoadingLazyComponent />}>
        <Outlet />
      </Suspense>
    </RealtimeUpdateProvider>
  );
};
export default KioskLayout;
