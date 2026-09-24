import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Upload from "./pages/Upload";
import Documents from "./pages/Documents";
import DocumentDetails from "./pages/DocumentDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Upload */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        {/* My Documents */}
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          }
        />

        {/* Single Document Details */}
        <Route
          path="/documents/:id"
          element={
            <ProtectedRoute>
              <DocumentDetails />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;