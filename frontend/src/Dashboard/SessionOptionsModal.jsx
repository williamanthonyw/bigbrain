import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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

function SessionOptionsModal({
  token,
  games,
  setGames,
  selectedGame,
  setSelectedGame,
  showConfirmation,
  setErrorMessage,
  setShowErrorAlert,
}) {
  const [savedSessionId, setSavedSessionId] = useState(0);
  const [sessionStatus, setSessionStatus] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // keep track of the sessionId for the game
  useEffect(() => {
    if (selectedGame?.active) {
      setSavedSessionId(selectedGame.active);
    }
  }, [selectedGame]);

  const gameURL = `${window.location.origin}/play?pin=${savedSessionId}`;

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
      show={selectedGame !== null}
      onHide={() => setSelectedGame(null)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedGame?.title || `Game ${selectedGame?.gameId}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column" style={{ gap: "10px" }}>
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
          {sessionStatus !== null && sessionStatus.active ? (
            <>
              <Link to={`/session/${selectedGame?.active}`}>
                <Button variant="primary" style={{ width: "100%" }}>
                  Manage Session
                </Button>
              </Link>
              <Button
                variant="danger"
                onClick={() =>
                  showConfirmation(
                    "End Game Session",
                    "Are you sure you want to end this game session?",
                    "danger",
                    endGame
                  )
                }
              >
                Stop Session
              </Button>
            </>
          ) : (
            <>
              <Link to={`/session/${selectedGame?.active}`}>
                <Button variant="primary" style={{ width: "100%" }}>
                  View Results
                </Button>
              </Link>
              <Button disabled variant="danger">
                Game Already Ended
              </Button>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default SessionOptionsModal;
