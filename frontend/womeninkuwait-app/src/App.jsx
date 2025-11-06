import React, { lazy } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AboutUs from "./pages/Aboutus";
import Join from "./pages/Join";
import Events from "./pages/Events";
import FaqPage from "./pages/Faq";
import Terms from "./pages/Terms";
import Policy from "./pages/Policy";
import Partner from "./pages/Partner";
import Contactus from "./pages/Contactus";
import Gallery from "./pages/Gallery";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));

export default function App() {
  return (
    <Routes>
      <Route path="/index.html" element={<Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/join" element={<Join />} />
        <Route path="/events" element={<Events />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/contact" element={<Contactus />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
