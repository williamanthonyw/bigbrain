import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import brainImg from './assets/brain.png';

function Login(props) {
  const success = props.setfunction;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (props.token){
      navigate('/dashboard');
    }
  }, [props.token, navigate]);
  

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
      const message = err.response?.data?.error || "Login failed. Please try again.";
      alert(message);
    }

  };
  
  return (
    <>
      <style>
        {`
          .form-input::placeholder {
            color: #b9bbbe;
            opacity: 1;
          }
        `}
      </style>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(145deg, #2c2f33, #23272a" }}>
        <img src={brainImg} alt="Brain Logo" className="mb-3" style={{ width: "80px", height: "80px" }} />
        <Container className="p-5 rounded shadow text-center"  style={{ backgroundColor: "#36393f", maxWidth: "400px", color: "white" }}>
          <h2 className="mb-4">Login</h2>
          <Form onSubmit={(e) => {
            e.preventDefault();
            login();
          }}>
            <Form.Group controlId="form-email">
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-3 form-input" required style={{ backgroundColor: "#2c2f33", border: "1px solid #7289da", color: "white" }}/>
            </Form.Group>
            <Form.Group controlId="form-password">
              <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-3 form-input" required style={{ backgroundColor: "#2c2f33", border: "1px solid #7289da", color: "white" }}/>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" style={{ backgroundColor: "#7289da", border: "none" }}> Log In</Button>
            <a href="/register" className="text-white mt-3 d-block" style={{ bottom: "20px", textDecoration: "underline", fontSize: "0.9rem" }}>New user? Register here</a>
          </Form>        
        </Container>
      </div>
    </>
  )
}

export default Login