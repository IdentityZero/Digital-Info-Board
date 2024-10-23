import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { DashboardLayout, PublicLayout } from "./layouts";
import { HomePage, NotFoundPage, LoginPage, SignUpPage } from "./pages/public";
import {
  AboutUsPage,
  AccountSettingsPage,
  DashBoardPage,
  LogoutPage,
  PermissionsPage,
  UploadContentPage,
} from "./pages/protected";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route
        path="/"
        element={
          <PublicRoutes>
            <PublicLayout />
          </PublicRoutes>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
      </Route>
      <Route
        path="dashboard"
        element={
          <ProtectedRoutes>
            <DashboardLayout />
          </ProtectedRoutes>
        }
      >
        <Route index element={<DashBoardPage />} />
        <Route path="upload-content" element={<UploadContentPage />} />
        <Route path="permissions" element={<PermissionsPage />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="account" element={<AccountSettingsPage />} />
        <Route path="logout" element={<LogoutPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
