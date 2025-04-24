import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import brainImg from './assets/brain.png';
import { useNavigate } from "react-router-dom";


function Play() {

  const [pin, setPin] = useState("");
  

  const navigate = useNavigate();

  const enterSession = (e) => {
    e.preventDefault();
    const sessionId = pin;
    navigate(`/play/${sessionId}`);
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
      <div className="d-flex flex-column vh-100 justify-content-center align-items-center position-relative" style={{ background: "linear-gradient(145deg, #2c2f33, #23272a)" }}>
        <img src={brainImg} alt="Brain Logo" className="mb-3" style={{ width: "80px", height: "80px" }} />
        <h1 className="mb-5 text-white">BigBrain</h1>
        <Container className="text-center p-5 rounded shadow" style={{ maxWidth: '500px', backgroundColor: "#36393f", color: "white",}}>
          <Form onSubmit={enterSession}>
            <Form.Group controlId="gamePin">
              <Form.Control type="text" placeholder="Enter Game PIN" value={pin} onChange={(e) => setPin(e.target.value)} className="mb-3 form-input" required style={{ backgroundColor: "#2c2f33", border: "1px solid #7289da", color: "white"}}/>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={!pin} style={{ backgroundColor: "#7289da", border: "none" }}>Start</Button>
          </Form>
        </Container>
      </div>

      
    </>
  );
}

export default Play;