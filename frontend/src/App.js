import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";
import ResetPassword from "./components/reset-password/ResetPassword";

// Secret components for testing
import Dashboard from "./components/dashboard/Dashboard";
import Logout from "./components/logout/Logout";
import HandModuleTest from "./components/hand-module/HandModuleTest";

function App() {
  return (
    <div>
      <br></br>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test-hand" element={<HandModuleTest />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
      <br></br>
      <br></br>
      <Footer />
    </div>
  );
}

export default App;
