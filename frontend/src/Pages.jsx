import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";



function Pages() {

  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const loggingIn = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    navigate('/dashboard');
  }

  console.log(token);

  const logout = async () => {
    try{
      const response = await axios.post('http://localhost:5005/admin/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      localStorage.removeItem('token');
      setToken(null);
      navigate('/login');

    }
    catch(err){
      alert(err);
    }
  };

  return (
    <>
 
      {token ? (
        <>
          <button onClick={logout}>Logout</button>
        </>
        
      ) : (
        <>
          <Link to="/register">Register</Link> &nbsp; | &nbsp; <Link to="/login">Login</Link>
        </>
      )}
      <hr />
      <Routes>
        <Route path="/register" element={<Register setfunction={loggingIn}/>}/>
        <Route path="/login" element={<Login setfunction={loggingIn}/>}/>
        <Route path="/dashboard" element={<Dashboard />}/>
      </Routes>
   

    </>
  )
}

export default Pages
