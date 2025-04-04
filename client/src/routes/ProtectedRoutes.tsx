import { Route } from "react-router-dom";
import {
  AccountSettingsPage,
  CalendarPage,
  ContentsPage,
  CurrentDisplayPage,
  DashBoardPage,
  DefaultDisplayPage,
  HelpPage,
  LogoutPage,
  PermissionsPage,
  SettingsPage,
  UploadContentPage,
} from "../pages/protected";
import NotificationsPage from "../pages/protected/NotificationsPage";
import {
  CreateImageContentPage,
  CreateTextContentPage,
  CreateVideoContentPage,
} from "../pages/protected/upload-content-pages";
import {
  ImageContentListPage,
  ImageContentPage,
  TextContentListPage,
  TextContentPage,
  VideoContentListPage,
} from "../pages/protected/content-pages";
import VideoContentPage from "../pages/protected/content-pages/VideoContentPage";
import AdminRouteGuard from "./AdminRouteGuard";
import {
  ActiveListPage,
  InActiveListPage,
} from "../pages/protected/permission-pages";
import CalendarContentsPageV2 from "../pages/protected/calendar-pages/CalendarContentsPageV2";
import CalendarSettingsPage from "../pages/protected/calendar-pages/CalendarSettingsPage";
import DefaultDisplaySettingsPage from "../pages/protected/default-display-pages/DefaultDisplaySettingsPage";
import OrganizationPage from "../pages/protected/default-display-pages/OrganizationPage";
import UpcomingEventsPage from "../pages/protected/default-display-pages/UpcomingEventsPage";
import MediaDisplaysPage from "../pages/protected/default-display-pages/MediaDisplaysPage";
import WeatherForecastSettingsPage from "../pages/protected/default-display-pages/WeatherForecastSettingsPage";
import {
  AddUpdateEmailPage,
  ChangeMyPasswordPage,
  ListOfAccountsPage,
  MyProfilePage,
  NewUsersPage,
  ViewProfilePage,
} from "../pages/protected/account-pages";

const ProtectedRoutes = (
  <>
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
    <Route
      path="permissions"
      element={
        <AdminRouteGuard>
          <PermissionsPage />
        </AdminRouteGuard>
      }
    >
      <Route index element={<ActiveListPage />} />
      <Route path="active" element={<ActiveListPage />} />
      <Route path="inactive" element={<InActiveListPage />} />
    </Route>
    <Route path="current-display" element={<CurrentDisplayPage />} />
    <Route path="calendar" element={<CalendarPage />}>
      <Route index element={<CalendarContentsPageV2 />} />
      <Route path="calendar" element={<CalendarContentsPageV2 />} />
      <Route path="settings" element={<CalendarSettingsPage />} />
    </Route>
    <Route path="default-display" element={<DefaultDisplayPage />}>
      <Route index element={<DefaultDisplaySettingsPage />} />
      <Route path="settings" element={<DefaultDisplaySettingsPage />} />
      <Route path="organization" element={<OrganizationPage />} />
      <Route path="events" element={<UpcomingEventsPage />} />
      <Route path="media" element={<MediaDisplaysPage />} />
      <Route path="forecast" element={<WeatherForecastSettingsPage />} />
    </Route>
    <Route path="account" element={<AccountSettingsPage />}>
      <Route index element={<MyProfilePage />} />
      <Route path="my-profile" element={<MyProfilePage />} />
      <Route
        path="my-profile/change-password"
        element={<ChangeMyPasswordPage />}
      />
      <Route path="my-profile/update-email" element={<AddUpdateEmailPage />} />
      <Route
        path="new-users"
        element={
          <AdminRouteGuard>
            <NewUsersPage />
          </AdminRouteGuard>
        }
      />
      <Route
        path="list-of-accounts"
        element={
          <AdminRouteGuard>
            <ListOfAccountsPage />
          </AdminRouteGuard>
        }
      />
      <Route
        path="list-of-accounts/:id"
        element={
          <AdminRouteGuard>
            <ViewProfilePage />
          </AdminRouteGuard>
        }
      />
    </Route>
    <Route path="settings" element={<SettingsPage />} />
    <Route path="logout" element={<LogoutPage />} />
    <Route path="help" element={<HelpPage />} />
  </>
);
export default ProtectedRoutes;
