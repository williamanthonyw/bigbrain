import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  InputGroup,
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

  return (
    <div style={{ maxWidth: '360px', width: '100%' }}>
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
      <h3>Players</h3>
      <p>{sessionStatus.players.length !== 0 ? sessionStatus.players : "No players yet!"}</p>
    </div>
  );
}
export default SessionLobby;
