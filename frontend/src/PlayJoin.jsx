import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PlayJoin(){

  const { sessionId } = useParams();
  const [showModal, setShowModal] = useState(true);
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const navigate = useNavigate();

  const joinSession = async () => {
    try{
      const response = await axios.post(`http://localhost:5005/play/join/${sessionId}`, 
        {
          name: playerName,
        }, {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          }
        },);
  
      setPlayerId(response.data.playerId);
      console.log(playerId);
      setShowModal(false);
      navigate(`/play/${sessionId}/${playerId}`);
    }

    catch (err){
      console.error('Error joining session', err);
    }
    
  };


  return(
    <>
      <div style={{background: "linear-gradient(145deg, #2c2f33, #23272a)",minHeight: "100vh",width: "100%",display: "flex",justifyContent: "center",alignItems: "center", flexDirection: "column"}}>
        <Modal show={showModal} centered style={{ backgroundColor: "transparent" }}>
          <div style={{ backgroundColor: "#23272a", borderRadius: "10px", color: "#ffffff" }}>
            <Modal.Header style={{backgroundColor: "#23272a", borderBottom: "none"}}>
              <Modal.Title style={{ color: "white" }}>Enter your name</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "#23272a" }}>
              <Form.Control type="text" placeholder="your name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} autoFocus style={{
                backgroundColor: "#2c2f33",
                color: "#ffffff",
                border: "1px solid #7289da",
                borderRadius: "5px"
              }}/>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#23272a", borderTop: 'none' }}>
              <Button variant="primary" onClick={joinSession} disabled={!playerName.trim()} style={{
                backgroundColor: "#7289da",
                border: "none",
                color: "white",
                width: "100%",
              }}>Join Game</Button>
            </Modal.Footer>
          </div>
        </Modal>
        
      </div>
      
    </>
  );
}

export default PlayJoin;