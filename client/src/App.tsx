import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { DashboardLayout, PublicLayout } from "./layouts";
import {
  HomePage,
  NotFoundPage,
  LoginPage,
  SignUpPage,
  AboutPage,
  ContactUsPage,
} from "./pages/public";
import {
  AccountSettingsPage,
  DashBoardPage,
  LogoutPage,
  UploadContentPage,
  CurrentDisplayPage,
  CalendarPage,
  DefaultDisplayPage,
  SettingsPage,
  HelpPage,
  ContentsPage,
  PermissionsPage,
} from "./pages/protected";

import {
  CreateImageContentPage,
  CreateTextContentPage,
  CreateVideoContentPage,
} from "./pages/protected/upload-content-pages";

import {
  ImageContentListPage,
  VideoContentListPage,
  TextContentListPage,
  TextContentPage,
  ImageContentPage,
} from "./pages/protected/content-pages";

import {
  MyProfilePage,
  ListOfAccountsPage,
  ViewProfilePage,
  ChangeMyPasswordPage,
  ChangeOthersPasswordPage,
} from "./pages/protected/account-pages";
import VideoContentPage from "./pages/protected/content-pages/VideoContentPage";
import AdminRoutes from "./routes/AdminRoutes";
import {
  ActiveListPage,
  InActiveListPage,
} from "./pages/protected/permission-pages";
import LiveAnnouncementKioskSize from "./pages/public/LiveAnnouncementKioskSize";

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
        <Route path="about-us" element={<AboutPage />} />
        <Route path="contact" element={<ContactUsPage />} />
      </Route>
      <Route path="kiosk" element={<LiveAnnouncementKioskSize />} />
      <Route
        path="dashboard"
        element={
          <ProtectedRoutes>
            <DashboardLayout />
          </ProtectedRoutes>
        }
      >
        <Route index element={<DashBoardPage />} />

        <Route path="upload-content" element={<UploadContentPage />}>
          <Route index element={<CreateVideoContentPage />} />
          <Route path="video" element={<CreateVideoContentPage />} />
          <Route path="text" element={<CreateTextContentPage />} />
          <Route path="image" element={<CreateImageContentPage />} />
        </Route>

        <Route path="contents" element={<ContentsPage />}>
          <Route index element={<VideoContentListPage />} />
          <Route path="video" element={<VideoContentListPage />} />
          <Route path="video/:id" element={<VideoContentPage />} />
          <Route path="text" element={<TextContentListPage />} />
          <Route path="text/:id" element={<TextContentPage />} />
          <Route path="image" element={<ImageContentListPage />} />
          <Route path="image/:id" element={<ImageContentPage />} />
        </Route>

        <Route
          path="permissions"
          element={
            <AdminRoutes>
              <PermissionsPage />
            </AdminRoutes>
          }
        >
          <Route index element={<ActiveListPage />} />
          <Route path="inactive" element={<InActiveListPage />} />
        </Route>

        <Route path="current-display" element={<CurrentDisplayPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="default-display" element={<DefaultDisplayPage />} />

        {/* Accounts Pages */}
        <Route path="account" element={<AccountSettingsPage />}>
          <Route index element={<MyProfilePage />} />
          <Route path="change-password" element={<ChangeMyPasswordPage />} />

          <Route
            path="list-of-accounts"
            element={
              <AdminRoutes>
                <ListOfAccountsPage />
              </AdminRoutes>
            }
          />
          <Route
            path="list-of-accounts/:id"
            element={
              <AdminRoutes>
                <ViewProfilePage />
              </AdminRoutes>
            }
          />
          <Route
            path="list-of-accounts/:id/change-password"
            element={
              <AdminRoutes>
                <ChangeOthersPasswordPage />
              </AdminRoutes>
            }
          />
        </Route>

        <Route path="settings" element={<SettingsPage />} />
        <Route path="logout" element={<LogoutPage />} />
        <Route path="help" element={<HelpPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
