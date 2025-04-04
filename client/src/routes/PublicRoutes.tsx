import { Route } from "react-router-dom";
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import SignUpPage from "../pages/public/SignUpPage";
import AboutPage from "../pages/public/AboutPage";
import ContactUsPage from "../pages/public/ContactUsPage";
import ForgotPasswordPage from "../pages/public/ForgotPasswordPage";
import ResetPasswordPage from "../pages/public/ResetPasswordPage";

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
