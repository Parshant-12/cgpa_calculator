import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import TargetCGPA from "./Pages/TargetCGPA";
import PercentageConverter from "./Pages/PercentageConverter";
import FAQ from "./Pages/FAQ";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import Footer from "./Components/Footer";
import LandingPage from "./Pages/LandingPage";
import Contribute from "./Pages/Contribute";
import ScrollToTop from "./Components/ScrollToTop";
import ReportCollege from "./Pages/ReportCollege";
import AdminPanel from "./Pages/AdminPanel";
import AdminRoute from "./Components/adminRoute";
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0c142a',
            color: '#fff',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            backdropFilter: 'blur(10px)',
          }
        }}
      />
      <ScrollToTop /> {/* Ensures the page scrolls to top on route change */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/calculator" element={<Dashboard />} />
          <Route path="/TargetCGPA" element={<TargetCGPA />} />
          <Route path="/percentage-converter" element={<PercentageConverter />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/ReportCollege" element={<ReportCollege />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Routes>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default App;