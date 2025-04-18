import { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router, 
  Routes, 
  Route
} from "react-router-dom";

import Home from './Home';
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
    else {
      localStorage.removeItem('token');
    }
  }, [token]);
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login token={token} setfunction={setToken} />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </Router>

    </>
  )
}

export default App
