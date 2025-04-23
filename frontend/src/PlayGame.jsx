import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PlayGame(){

  const { sessionId, playerId } = useParams();
  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const navigate = useNavigate();

  return(
    <>
      
    </>
  );
}

export default PlayGame;