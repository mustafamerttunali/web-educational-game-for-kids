import React, {useState} from "react";
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

// Games
import CountGame from "./components/count-game/CountGame";
import MathGame from "./components/math-game/MathGame";
import ChoosingGame from "./components/choosing-game/ChoosingGame";

import { GestureContext, HandCoordinateContext } from "./components/hand-module/GestureContext";

function App() {
  const value = React.useState(null);
  const value2 = React.useState(null); // Coordinates
  return (
    <div>
      <br></br>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test-hand" element={
          <GestureContext.Provider value={value}>
              <HandModuleTest />
          </GestureContext.Provider>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/count-game" element={
              <GestureContext.Provider value={value}>
                  <CountGame isChoosingGame={false}/>
              </GestureContext.Provider>
              } />
            <Route path="/math-game" element={
              <GestureContext.Provider value={value}>
                  <MathGame isChoosingGame={false}/>
              </GestureContext.Provider>
              } />
            <Route path="choosing-game" element={
              <HandCoordinateContext.Provider value={value2}>
                  <ChoosingGame isChoosingGame={true}/>
              </HandCoordinateContext.Provider>
              } />
        </Routes>
      </Router>
      <br></br>
      <br></br>
      <Footer />
    </div>
  );
}

export default App;
