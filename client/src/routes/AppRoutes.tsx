import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import PublicRouteGuard from "./PublicRouteGuard";
import PublicLayout from "../layouts/PublicLayout";
import publicRoutes from "./PublicRoutes";
import KioskLayout from "../layouts/KioskLayout";
import KioskDisplayPage from "../pages/public/KioskDisplayPage";
import ProtectedRouteGuard from "./ProtectedRouteGuard";
import DashboardLayout from "../layouts/DashboardLayout";
import protectedRoutes from "./ProtectedRoutes";
import { NotFoundPage } from "../pages/public";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* Public Pages */}
      <Route
        path="/"
        element={
          <PublicRouteGuard>
            <PublicLayout />
          </PublicRouteGuard>
        }
      >
        {publicRoutes}
      </Route>

      {/* Kiosk Page */}
      <Route path="kiosk" element={<KioskLayout />}>
        <Route index element={<KioskDisplayPage />} />
      </Route>

      {/* Protected Pages */}
      <Route
        path="dashboard"
        element={
          <ProtectedRouteGuard>
            <DashboardLayout />
          </ProtectedRouteGuard>
        }
      >
        {protectedRoutes}
      </Route>

      {/* Not Found Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

export default router;
