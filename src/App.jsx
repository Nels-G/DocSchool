import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingPage from "./pages/loadingPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoadingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
