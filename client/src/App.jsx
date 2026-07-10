import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CoursesPage from "./pages/CoursesPage";
import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <ProtectedRoute>
            <CoursesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/course/:id"
        element={
          <ProtectedRoute>
            <CoursePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lesson/:id"
        element={
          <ProtectedRoute>
            <LessonPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}