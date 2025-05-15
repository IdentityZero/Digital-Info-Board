import { Route } from "react-router-dom";
import { lazy } from "react";

// Protected pages
const AccountSettingsPage = lazy(
  () => import("../pages/protected/AccountSettingsPage")
);
const CalendarPage = lazy(() => import("../pages/protected/CalendarPage"));
const ContentsPage = lazy(() => import("../pages/protected/ContentsPage"));
const CurrentDisplayPage = lazy(
  () => import("../pages/protected/CurrentDisplayPage")
);
const DashBoardPage = lazy(() => import("../pages/protected/DashBoardPage"));
const DefaultDisplayPage = lazy(
  () => import("../pages/protected/DefaultDisplayPage")
);
const HelpPage = lazy(() => import("../pages/protected/HelpPage"));
const LogoutPage = lazy(() => import("../pages/protected/LogoutPage"));
const PermissionsPage = lazy(
  () => import("../pages/protected/PermissionsPage")
);
const SettingsPage = lazy(() => import("../pages/protected/SettingsPage"));
const UploadContentPage = lazy(
  () => import("../pages/protected/UploadContentPage")
);
const NotificationsPage = lazy(
  () => import("../pages/protected/NotificationsPage")
);

// Upload content pages
const CreateImageContentPage = lazy(
  () => import("../pages/protected/upload-content-pages/CreateImageContentPage")
);
const CreateTextContentPage = lazy(
  () => import("../pages/protected/upload-content-pages/CreateTextContentPage")
);
const CreateVideoContentPage = lazy(
  () => import("../pages/protected/upload-content-pages/CreateVideoContentPage")
);
const CreateUrgentContentPage = lazy(
  () =>
    import("../pages/protected/upload-content-pages/CreateUrgentContentPage")
);

// Content pages
const ImageContentListPage = lazy(
  () =>
    import("../pages/protected/content-pages/ListPages/ImageContentListPage")
);
const ImageContentPage = lazy(
  () => import("../pages/protected/content-pages/ImageContentPage")
);
const TextContentListPage = lazy(
  () => import("../pages/protected/content-pages/ListPages/TextContentListPage")
);
const TextContentPage = lazy(
  () => import("../pages/protected/content-pages/TextContentPage")
);
const VideoContentListPage = lazy(
  () =>
    import("../pages/protected/content-pages/ListPages/VideoContentListPage")
);
const VideoContentPage = lazy(
  () => import("../pages/protected/content-pages/VideoContentPage")
);
const UrgentContentListPage = lazy(
  () =>
    import("../pages/protected/content-pages/ListPages/UrgentContentListPage")
);
const RetrieveUrgentContentPage = lazy(
  () =>
    import(
      "../pages/protected/content-pages/RetrievePages/RetrieveUrgentContentPage"
    )
);
const EditUrgentContentPage = lazy(
  () =>
    import("../pages/protected/content-pages/EditPages/EditUrgentContentPage")
);

// Permission pages
const ActiveListPage = lazy(
  () => import("../pages/protected/permission-pages/ActiveListPage")
);
const InActiveListPage = lazy(
  () => import("../pages/protected/permission-pages/InActiveListPage")
);

// Calendar pages
const CalendarContentsPageV2 = lazy(
  () => import("../pages/protected/calendar-pages/CalendarContentsPageV2")
);
const CalendarSettingsPage = lazy(
  () => import("../pages/protected/calendar-pages/CalendarSettingsPage")
);

// Default display pages
const DefaultDisplaySettingsPage = lazy(
  () =>
    import(
      "../pages/protected/default-display-pages/DefaultDisplaySettingsPage"
    )
);
const OrganizationPage = lazy(
  () => import("../pages/protected/default-display-pages/OrganizationPage")
);
const UpcomingEventsPage = lazy(
  () => import("../pages/protected/default-display-pages/UpcomingEventsPage")
);
const MediaDisplaysPage = lazy(
  () => import("../pages/protected/default-display-pages/MediaDisplaysPage")
);

// Account pages
const AddUpdateEmailPage = lazy(
  () => import("../pages/protected/account-pages/AddUpdateEmailPage")
);
const ChangeMyPasswordPage = lazy(
  () => import("../pages/protected/account-pages/ChangeMyPasswordPage")
);
const ListOfAccountsPage = lazy(
  () => import("../pages/protected/account-pages/ListOfAccountsPage")
);
const MyProfilePage = lazy(
  () => import("../pages/protected/account-pages/MyProfilePage")
);
const NewUsersPage = lazy(
  () => import("../pages/protected/account-pages/NewUsersPage")
);
const ViewProfilePage = lazy(
  () => import("../pages/protected/account-pages/ViewProfilePage")
);

const MessagesPage = lazy(() => import("../pages/protected/MessagesPage"));

// Admin route guard (keep direct import if it's small or essential)
import AdminRouteGuard from "./AdminRouteGuard";

const ProtectedRoutes = (
  <>
    <Route index element={<DashBoardPage />} />
    <Route path="notifications" element={<NotificationsPage />} />
    <Route path="upload-content" element={<UploadContentPage />}>
      <Route index element={<CreateVideoContentPage />} />
      <Route path="video" element={<CreateVideoContentPage />} />
      <Route path="text" element={<CreateTextContentPage />} />
      <Route path="image" element={<CreateImageContentPage />} />
      <Route path="urgent" element={<CreateUrgentContentPage />} />
    </Route>
    <Route path="contents" element={<ContentsPage />}>
      <Route index element={<VideoContentListPage />} />
      <Route path="video" element={<VideoContentListPage />} />
      <Route path="video/:id" element={<VideoContentPage />} />
      <Route path="text" element={<TextContentListPage />} />
      <Route path="text/:id" element={<TextContentPage />} />
      <Route path="image" element={<ImageContentListPage />} />
      <Route path="image/:id" element={<ImageContentPage />} />
      <Route path="urgent" element={<UrgentContentListPage />} />
      <Route path="urgent/:id" element={<RetrieveUrgentContentPage />} />
      <Route path="urgent/:id/edit" element={<EditUrgentContentPage />} />
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
    </Route>
    <Route path="contact-us-messages" element={<MessagesPage />} />
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
