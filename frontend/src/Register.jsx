import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import brainImg from './assets/brain.png';

function Register(props) {
  const success = props.setfunction;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (props.token) {
      navigate('/dashboard');
    }
    console.log(props.token);
  }, [props.token, navigate]);

  const register = async () => {

    // checking for matching password input
    if (password !== confirmPassword) {
      alert("Passwords do not amtch.");
      return;
    }

    try{
      const response = await axios.post('http://localhost:5005/admin/auth/register', {
        name: username,
        email: email,
        password: password,
      });
        
      const token = response.data.token;
      // store email for use when creating games in Dashboard
      localStorage.setItem("email", email);
      success(token);
    }
    catch(err){
      alert(err.response?.data?.error || "Registration failed.");
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
          <h2 className="mb-4">Register</h2>
          <Form onSubmit={(e) => {
            e.preventDefault();
            register();
          }}>
            <Form.Group controlId="form-username">
              <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} className="mb-3 form-input" required style={{ backgroundColor: "#2c2f33", border: "1px solid #7289da", color: "white" }}/>
            </Form.Group>
            <Form.Group controlId="form-email">
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-3 form-input" required style={{ backgroundColor: "#2c2f33", border: "1px solid #7289da", color: "white" }}/>
            </Form.Group>
            <Form.Group controlId="form-password">
              <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-3 form-input" required style={{ backgroundColor: "#2c2f33", border: "1px solid #7289da", color: "white" }}/>
            </Form.Group>
            <Form.Group controlId="form-confirm-password">
              <Form.Control type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mb-3 form-input" required style={{ backgroundColor: "#2c2f33", border: "1px solid #7289da", color: "white" }}/>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" style={{ backgroundColor: "#7289da", border: "none" }}> Register</Button>
            <Link to="/login" className="text-white mt-3 d-block" style={{ bottom: "20px", textDecoration: "underline", fontSize: "0.9rem" }}>Existing user? Log in here</Link>
          </Form>        
        </Container>
      </div>
    </>
  )
}

export default Register
