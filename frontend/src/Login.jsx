import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Login(props) {
  const success = props.setfunction;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  if (props.token){
    navigate('/dashboard');
  }

  const login = async () => {
    console.log(email, password);

    try{
      const response = await axios.post('http://localhost:5005/admin/auth/login', {
        email: email,
        password: password,
      });
      
      const token = response.data.token;
      success(token);
    }
    catch(err){
      alert(err.response.data.error);
    }

  };
  
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(145deg, #2c2f33, #23272a" }}>
        <Container className="p-5 rounded shadow text-center">
          <h1>Login</h1>
          Email: <input value={email} onChange={(e) => setEmail(e.target.value)} type="text"></input> <br />
          Password: <input value={password} onChange={(e) => setPassword(e.target.value)} type="password"></input> <br />
          <button onClick={login}>Login</button>
        </Container>
      </div>
    </>
  )
}

export default Login