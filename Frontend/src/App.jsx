import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import TargetCGPA from "./Pages/TargetCGPA";
import PercentageConverter from "./Pages/PercentageConverter";
import FAQ from "./Pages/FAQ";
import SignUp from "./Pages/Signup";
import SignIn from "./Pages/SignIn";
import LandingPage from "./Pages/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/calculator" element={<Dashboard />} />
      <Route path="/TargetCGPA" element={<TargetCGPA />} />
      <Route path="/percentage-converter" element={<PercentageConverter />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;