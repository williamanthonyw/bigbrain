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

  useEffect(() => {
    const getSessionStatus = async () => {
      if (!selectedGame?.active) return;
      try {
        const response = await axios.get(
          `http://localhost:5005/admin/session/${selectedGame?.active}/status`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setSessionStatus(response.data.results);
          console.log(sessionStatus);
        }
      } catch (err) {
        console.error("Error fetching session status: ", err);
        const msg =
          err.response?.data?.error || err.message || "Something went wrong :c";
        setErrorMessage(msg);
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 5000);
      }
    };
    getSessionStatus();
  }, [selectedGame]);

  const endGame = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5005/admin/game/${selectedGame.gameId}/mutate`,
        {
          mutationType: "END",
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const { status } = response.data.data;
        // update the game list with the new sessionId
        setGames(
          games.map((g) =>
            g.gameId === selectedGame.gameId ? { ...g, active: null } : g
          )
        );
        setSessionStatus({ sessionStatus, active: false });
      }
    } catch (err) {
      console.error("Error hosting game: ", err);
      const msg =
        err.response?.data?.error || err.message || "Something went wrong :c";
      setErrorMessage(msg);
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 5000);
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
