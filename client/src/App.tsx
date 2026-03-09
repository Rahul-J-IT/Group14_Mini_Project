import UserLogin from "./pages/UserLogin"
import UserRegister from "./pages/UserRegister"
import ProtectedRoutes from "./routes/ProtectedRoutes"
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import AllCoursesPage from "./pages/AllCoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  // Re-calculate on every render to ensure it stays in sync with localStorage
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <BrowserRouter>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isLoggedIn={isLoggedIn} />

      <main>
        <Routes>
          <Route path="/userLogin" element={<UserLogin />} />
          <Route path="/userRegister" element={<UserRegister />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/user/profile/:id" element={<ProfilePage />} />
          </Route>

          <Route path="/courses/:section" element={<AllCoursesPage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />

          <Route path="*" element={<UserLogin />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
