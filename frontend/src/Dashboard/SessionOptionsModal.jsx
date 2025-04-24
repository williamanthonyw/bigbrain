import { useState } from "react";
import {
  Button,
  FormControl,
  Modal,
  InputGroup,
  FormLabel,
  FormGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

function SessionOptionsModal({ selectedSession, setSelectedSession }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const gameURL = `${window.location.origin}/play?pin=${selectedSession?.active}`;

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
    <Modal
      show={selectedSession !== null}
      onHide={() => setSelectedSession(null)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedSession?.title || `Game ${selectedSession?.gameId}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup>
          <FormLabel>URL</FormLabel>
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
        <Button
          variant="primary"
          onClick={() => {
            // Handle start session logic here
            setSelectedSession(null);
          }}
        >
          Start Session
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            // Handle edit session logic here
            setSelectedSession(null);
          }}
        >
          Edit Session
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            // Handle delete session logic here
            setSelectedSession(null);
          }}
        >
          Delete Session
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default SessionOptionsModal;
