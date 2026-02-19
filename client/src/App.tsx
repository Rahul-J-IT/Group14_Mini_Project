import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import AllCoursesPage from "./pages/AllCoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LecturerDashboardPage from "./pages/LecturerDashboardPage";
import CourseFormPage from "./pages/CourseFormPage";
import { LecturerCoursesProvider } from "./context/LecturerCoursesContext";

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <LecturerCoursesProvider>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main>
          <Routes>
            {/* Student routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/courses/:section" element={<AllCoursesPage />} />
            <Route path="/course/:id" element={<CourseDetailPage />} />

            {/* Lecturer routes */}
            <Route path="/lecturer/dashboard" element={<LecturerDashboardPage />} />
            <Route path="/lecturer/courses/new" element={<CourseFormPage />} />
            <Route path="/lecturer/courses/edit/:id" element={<CourseFormPage />} />
          </Routes>
        </main>
      </LecturerCoursesProvider>
    </BrowserRouter>
  );
};

export default App;
