import { useParams } from "react-router-dom";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PlayJoin(){

  const { sessionId } = useParams();
  const [showModal, setShowModal] = useState(true);
  const [playerName, setPlayerName] = useState("");

  const navigate = useNavigate();

  const joinSession = async () => {
    try{
      const response = await axios.post(`http://localhost:5005/play/join/${Number(sessionId)}`, 
        {
          name: playerName,
        }, {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          }
        },);
      const p = response.data.playerId;
      setShowModal(false);
      navigate(`/play/${sessionId}/${p}`);
      console.log(p);
    }

    catch (err){
      console.error('Error joining session', err);
    }
    
  };


  return(
    <>
      <style>
        {`
          .custom-modal-dialog {
            max-width: 90vw;
            margin: auto;
          }

          .custom-modal-content {
            background-color: #23272a;
            border-radius: 10px;
            color: white;
            padding: 1.5rem;
            border: none;
          }

          @media (max-width: 500px) {
            .custom-modal-content {
              padding: 1.25rem;
            }
          }
        `}
      </style>
      <div style={{background: "linear-gradient(145deg, #2c2f33, #23272a)",minHeight: "100vh",width: "100%",display: "flex",justifyContent: "center",alignItems: "center", flexDirection: "column"}}>
        <Modal
          show={showModal}
          centered
          dialogClassName="custom-modal-dialog"
          contentClassName="custom-modal-content"
        >
          <Modal.Header style={{ borderBottom: "none", background: "transparent" }}>
            <Modal.Title>Enter your name</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Control
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              autoFocus
              style={{
                backgroundColor: "#2c2f33",
                border: "1px solid #7289da",
                color: "white"
              }}
            />
          </Modal.Body>

          <Modal.Footer style={{ borderTop: "none" }}>
            <Button
              style={{ backgroundColor: "#7289da", border: "none", width: "100%" }}
              disabled={!playerName.trim()}
              onClick={joinSession}
            >
              Join Game
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      
    </>
  );
}

export default PlayJoin;