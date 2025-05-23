import { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router, 
  Routes, 
  Route,
  useNavigate
} from "react-router-dom";

import Home from './Home';
import Login from "./Login";
import Dashboard from "./Dashboard/Dashboard";
import Register from "./Register";
import Play from "./Play";
import GameDetails from "./GameDetails";
import QuestionDetails from "./QuestionDetails";
import Session from "./Session/Session";
import PlayJoin from "./PlayJoin";
import PlayGame from "./PlayGame";
import PlayResults from "./PlayResults";

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
    <Router>
      <AppRoutes token={token} setToken={setToken}/>
    </Router>
  );
}

function AppRoutes({ token, setToken }) {
  const navigate = useNavigate();

  const logout = async () => {
    try{
      await axios.post('http://localhost:5005/admin/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setToken(null);
      localStorage.removeItem("email");
      navigate('/');
    }
    catch(err){
      alert(err.response?.data?.error || "Logout failed.");
    }

  };

  return (
    <Routes>
      <Route path="/" element={<Home token={token} />} />
      <Route path="/play" element={<Play token={token} />} />
      <Route path="/login" element={<Login token={token} setfunction={setToken} />} />
      <Route path="/register" element={<Register token={token} setfunction={setToken} />} />
      <Route path="/dashboard" element={<Dashboard token={token} logout={logout} />} />
      <Route path="/game/:id" element={<GameDetails token={token} logout={logout}/>} />
      <Route path="/game/:gameId/question/:questionId" element={<QuestionDetails token={token} logout={logout}/>} />
      <Route path="/session/:sessionId" element={<Session token={token} logout={logout}/>} />
      <Route path="/play/:sessionId/:playerId/results" element={<PlayResults />}/>
      <Route path="/play/:sessionId/:playerId" element={<PlayGame />} />
      <Route path="/play/:sessionId" element={<PlayJoin />} />
    </Routes>
  );
};

export default App
