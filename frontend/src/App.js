import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Routes>
      </Router>
      <br></br>
      <br></br>
      <Footer />
    </div>
  );
}

export default App;
