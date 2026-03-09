import UserLogin from "./pages/UserLogin"
import UserRegister from "./pages/UserRegister"
import ProtectedRoutes from "./routes/ProtectedRoutes"
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import AllCoursesPage from "./pages/AllCoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ProfilePage from "./pages/ProfilePage";

import InstructorPage from "./pages/InstructorPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import CreateQuizPage from "./pages/CreateQuizPage";


function App() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isLoggedIn] = useState<boolean>(false); // Change to true after login
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
            <Route path="/instructor" element={<InstructorPage />} />
            <Route path="/instructor/createCourse" element={<CreateCoursePage />} />
            <Route path="/instructor/createQuiz" element={<CreateQuizPage />} />
            <Route path="/instructor/editCourse/:id" element={<CreateCoursePage />} />
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
