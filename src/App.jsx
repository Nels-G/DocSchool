import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingPage from "./pages/loading/loadingPage"; 
import LoginPage from "./pages/loginPage/loginPage";
import ResetPasswordPage from "./pages/resetPasswordPage/resetPasswordPage";
import SignupPage from "./pages/signupPage/signupPage";
import HomePage from "./pages/home/homePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/accueil" element={<HomePage/>} />
      </Routes>
    </BrowserRouter>
  );
}