import { useState, useEffect } from "react";
import axios from "axios";


import {
  BrowserRouter as Router, 
  Routes, 
  Route
} from "react-router-dom";

import Home from './Home';
import Login from "./Login";

function App() {

  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </Router>

    </>
  )
}

export default App
