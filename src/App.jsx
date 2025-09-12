import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingPage from "./pages/loading/loadingPage"; 
import LoginPage from "./pages/loginPage/loginPage";
import ResetPasswordPage from "./pages/resetPasswordPage/resetPasswordPage";
import SignupPage from "./pages/signupPage/signupPage";
import HomePage from "./pages/home/homePage";
// import DocDetailPage from "./pages/docDetail/docDetailPage";
import UsersProfilPage from "./pages/usersProfil/usersProfilPage";
import MesDocumentsPage from "./pages/mesDocuments/mesDocumentsPage";
import DocFavorisPage from "./pages/DocFavoris/DocFavorisPage";
import DocTelechargementPage from "./pages/DocTelechargement/DocTelechargementPage";
import DashboardPage from "./pages/Dashboard/dashboard/dashboardPage";
import FilierePage from "./pages/Dashboard/filiere/filierePage";
import UtilisateursListPage from "./pages/Dashboard/utilisateursList/utilisateursListPage";
import DocumentsPage from "./pages/Dashboard/documents/documentsPage";
import TestPdfPage from "./pages/docDetail/docDetailPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoadingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<ResetPasswordPage />} />
        <Route path="/accueil" element={<HomePage/>} />
        {/* <Route path="/document/detail" element={<DocDetailPage/>} /> */}
        <Route path="/document/detail/:id" element={<TestPdfPage />} />
        <Route path="/user/profil" element={<UsersProfilPage/>} />
        <Route path="/user/document" element={<MesDocumentsPage/>} />
        <Route path="/user/favoris" element={<DocFavorisPage/>} />
        <Route path="/user/telechargement" element={<DocTelechargementPage/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/filieres" element={<FilierePage/>} />
        <Route path="/utilisateurs" element={<UtilisateursListPage/>} />
        <Route path="/documents" element={<DocumentsPage/>} />
        <Route path="/parametres/corbeille" element={<FilierePage/>} />
      </Routes>
    </BrowserRouter>
  );
}