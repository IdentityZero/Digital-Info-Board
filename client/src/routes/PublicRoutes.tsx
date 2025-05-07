import { lazy } from "react";
import { Route } from "react-router-dom";

const HomePage = lazy(() => import("../pages/public/HomePage"));
const LoginPage = lazy(() => import("../pages/public/LoginPage"));
const SignUpPage = lazy(() => import("../pages/public/SignUpPage"));
const AboutPage = lazy(() => import("../pages/public/AboutPage"));
const ContactUsPage = lazy(() => import("../pages/public/ContactUsPage"));
const ForgotPasswordPage = lazy(
  () => import("../pages/public/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(
  () => import("../pages/public/ResetPasswordPage")
);

const publicRoutes = (
  <>
    <Route index element={<HomePage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="signup" element={<SignUpPage />} />
    <Route path="about-us" element={<AboutPage />} />
    <Route path="contact" element={<ContactUsPage />} />
    <Route path="forgot-password" element={<ForgotPasswordPage />} />
    <Route path="reset-password/:id/:token" element={<ResetPasswordPage />} />
  </>
);
export default publicRoutes;
