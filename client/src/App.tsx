import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import AdminRoutes from "./routes/AdminRoutes";

import { DashboardLayout, PublicLayout } from "./layouts";

import {
  HomePage,
  NotFoundPage,
  LoginPage,
  SignUpPage,
  AboutPage,
  ContactUsPage,
  KioskDisplayPage,
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
  NewUsersPage,
} from "./pages/protected/account-pages";

import VideoContentPage from "./pages/protected/content-pages/VideoContentPage";

import {
  ActiveListPage,
  InActiveListPage,
} from "./pages/protected/permission-pages";

// Default Display Pages
import DefaultDisplaySettingsPage from "./pages/protected/default-display-pages/DefaultDisplaySettingsPage";
import OrganizationPage from "./pages/protected/default-display-pages/OrganizationPage";
import UpcomingEventsPage from "./pages/protected/default-display-pages/UpcomingEventsPage";
import MediaDisplaysPage from "./pages/protected/default-display-pages/MediaDisplaysPage";
import WeatherForecastSettingsPage from "./pages/protected/default-display-pages/WeatherForecastSettingsPage";

// Calendar Pages
import CalendarContentsPageV2 from "./pages/protected/calendar-pages/CalendarContentsPageV2";
// import CalendarContentsPage from "./pages/protected/calendar-pages/CalendarContentsPage";
import CalendarSettingsPage from "./pages/protected/calendar-pages/CalendarSettingsPage";
import NotificationsPage from "./pages/protected/NotificationsPage";

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
      <Route path="kiosk" element={<KioskDisplayPage />} />

      <Route
        path="dashboard"
        element={
          <ProtectedRoutes>
            <DashboardLayout />
          </ProtectedRoutes>
        }
      >
        <Route index element={<DashBoardPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
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
        {/* Permission Pages */}
        <Route
          path="permissions"
          element={
            <AdminRoutes>
              <PermissionsPage />
            </AdminRoutes>
          }
        >
          <Route index element={<ActiveListPage />} />
          <Route path="active" element={<ActiveListPage />} />
          <Route path="inactive" element={<InActiveListPage />} />
        </Route>
        <Route path="current-display" element={<CurrentDisplayPage />} />
        {/* Calendar Pages */}

        <Route path="calendar" element={<CalendarPage />}>
          {/* <Route index element={<CalendarContentsPage />} /> */}
          <Route index element={<CalendarContentsPageV2 />} />
          <Route path="calendar" element={<CalendarContentsPageV2 />} />
          <Route path="settings" element={<CalendarSettingsPage />} />
        </Route>

        {/* Default Display Pages */}
        <Route path="default-display" element={<DefaultDisplayPage />}>
          <Route index element={<DefaultDisplaySettingsPage />} />
          <Route path="settings" element={<DefaultDisplaySettingsPage />} />
          <Route path="organization" element={<OrganizationPage />} />
          <Route path="events" element={<UpcomingEventsPage />} />
          <Route path="media" element={<MediaDisplaysPage />} />
          <Route path="forecast" element={<WeatherForecastSettingsPage />} />
        </Route>
        {/* Accounts Pages */}
        <Route path="account" element={<AccountSettingsPage />}>
          <Route index element={<MyProfilePage />} />
          <Route path="my-profile" element={<MyProfilePage />} />
          <Route path="change-password" element={<ChangeMyPasswordPage />} />

          <Route
            path="new-users"
            element={
              <AdminRoutes>
                <NewUsersPage />
              </AdminRoutes>
            }
          />
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
