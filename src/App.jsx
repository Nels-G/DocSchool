import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingPage from "./pages/loading/loadingPage"; 
import LoginPage from "./pages/loginPage/loginPage";
import ResetPasswordPage from "./pages/resetPasswordPage/resetPasswordPage";
import SignupPage from "./pages/signupPage/signupPage";
import HomePage from "./pages/home/homePage";
import DocDetailPage from "./pages/docDetail/docDetailPage";
import UsersProfilPage from "./pages/usersProfil/usersProfilPage";
import MesDocumentsPage from "./pages/mesDocuments/mesDocumentsPage";
import DocFavorisPage from "./pages/DocFavoris/DocFavorisPage";
import DocTelechargementPage from "./pages/DocTelechargement/DocTelechargementPage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/accueil" element={<HomePage/>} />
        <Route path="/document/detail" element={<DocDetailPage/>} />
        <Route path="/user/profil" element={<UsersProfilPage/>} />
        <Route path="/user/document" element={<MesDocumentsPage/>} />
        <Route path="/user/favoris" element={<DocFavorisPage/>} />
        <Route path="/user/telechargement" element={<DocTelechargementPage/>} />
      </Routes>
    </BrowserRouter>
  );
}