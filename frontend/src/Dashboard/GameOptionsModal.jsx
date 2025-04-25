import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Modal,
} from "react-bootstrap";

function GameOptionsModal({
  token,
  games,
  setGames,
  selectedGame,
  setSelectedGame,
  setSelectedGameSession,
  showConfirmation,
  confirmDialog,
  setConfirmDialog,
  setErrorMessage,
  setShowErrorAlert,
}) {
  // host a game session then open modal with game URL
  const hostGame = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5005/admin/game/${selectedGame.gameId}/mutate`,
        {
          mutationType: "START",
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const { sessionId } = response.data.data;
        // update the game list with the new sessionId
        setGames(
          games.map((g) =>
            g.gameId === selectedGame.gameId ? { ...g, active: sessionId } : g
          )
        );
        setSelectedGame(null);
        setSelectedGameSession({ ...selectedGame, active: sessionId });
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

  // delete game from delete dialog, use selectedGame dialog to check for match
  const deleteGame = async () => {
    try {
      // get full list of games, remove game then put
      let response = await axios.get("http://localhost:5005/admin/games", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedGames = games.filter(
        (game) => game.gameId !== selectedGame.gameId
      );

      response = await axios.put(
        "http://localhost:5005/admin/games",
        {
          games: updatedGames,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // hide modals
        setConfirmDialog({ ...confirmDialog, show: false });
        setSelectedGame(null);
        setGames(updatedGames);
      }
    } catch (err) {
      console.error("Error creating game: ", err);
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
        <div className="d-flex flex-column gap-2">
          {
            // disable start game button if game is already active
            selectedGame?.active && selectedGame?.active !== null ? (
              <>
                <Button disabled variant="success">
                  Game already active
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="success"
                  onClick={() =>
                    showConfirmation(
                      "Start Game",
                      "Are you sure you want to start this game?",
                      "success",
                      hostGame
                    )
                  }
                >
                  Start Game
                </Button>
              </>
            )
          }
          <Dropdown>
            {selectedGame?.oldSessions?.length ? (
              <DropdownToggle variant="secondary" className="w-100">
                View Past Results
              </DropdownToggle>
            ) : (
              <DropdownToggle variant="secondary" className="w-100" disabled>
                No Results Available
              </DropdownToggle>
            )}
            <DropdownMenu
              className="text-center w-100"
              style={{
                maxHeight: "calc(50vh - 50px)",
                overflowY: "auto",
                display: "block",
              }}
            >
              {selectedGame?.oldSessions?.map((sessionId, index) => (
                <DropdownItem
                  key={index}
                  as={Link}
                  to={`/session/${sessionId}`}
                >
                  {sessionId}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Link to={`/game/${selectedGame?.gameId}`}>
            <Button variant="primary" className="w-100">
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            onClick={() =>
              showConfirmation(
                "Delete Game",
                "Are you sure you want to delete this game?",
                "danger",
                deleteGame
              )
            }
          >
            Delete
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setSelectedGame(null)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GameOptionsModal;
