import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  InputGroup,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

function SessionLobby(props) {
  const { sessionId } = useParams();
  const [showTooltip, setShowTooltip] = useState(false);

  const sessionStatus = props.sessionStatus;
  const gameURL = `${window.location.origin}/play?pin=${sessionId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(gameURL);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 1000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const advanceGame = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5005/admin/game/${props.game.gameId}/mutate`,
        {
          mutationType: "ADVANCE",
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${props.token}`,
          },
        }
      );
      if (response.status === 200) {
        const { status, position } = response.data.data;
        // update the game list with the new sessionId
        props.setSessionStatus({ ...sessionStatus, position: position });
        // marginally slower: fetch status from server
        await props.fetchStatus();
      }
    } catch (err) {
      console.error("Error hosting game: ", err);
    }
  };

  return (
    <div style={{ maxWidth: "360px", width: "100%" }}>
      {sessionStatus.position === -1 ? (
        <>
          <h2>In Lobby</h2>
          <FormGroup>
            <FormLabel>Invite Link 📩</FormLabel>
            <InputGroup className="mb-3">
              <FormControl readOnly placeholder="URL" value={gameURL} />
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip className="copy-tooltip">Copied!</Tooltip>}
                show={showTooltip}
              >
                <Button variant="outline-secondary" onClick={copyToClipboard}>
                  <i className="bi bi-clipboard"></i>
                </Button>
              </OverlayTrigger>
            </InputGroup>
          </FormGroup>
        </>
      ) : (
        <>
          <h2>
            {`Question ${sessionStatus.position + 1}/${
              sessionStatus.questions.length
            }`}
          </h2>
          <h3>{`Time remaining: ${1}s`}</h3>
        </>
      )}
      <h3>Players</h3>
      <ListGroup>
        {sessionStatus.players.length !== 0 ? (
          sessionStatus.players.map((player, index) => (
            <ListGroupItem key={index}>{player}</ListGroupItem>
          ))
        ) : (
          <ListGroupItem>{"No players yet!"}</ListGroupItem>
        )}
      </ListGroup>
      <Button
        variant="primary"
        style={{ width: "100%", marginTop: "10px" }}
        onClick={advanceGame}
      >
        {sessionStatus.position === -1 ? "Start Game" : "Next Question"}
      </Button>
    </div>
  );
}
export default SessionLobby;
