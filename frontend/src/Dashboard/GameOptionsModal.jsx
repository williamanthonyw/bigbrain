import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

function GameOptionsModal({
  token,
  games,
  setGames,
  selectedGame,
  setSelectedGame,
  showConfirmation,
  confirmDialog,
  setConfirmDialog,
  setErrorMessage,
  setShowErrorAlert,
}) {
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
        <div className="d-flex flex-column" style={{ gap: "10px" }}>
          <Button
            variant="success"
            onClick={() =>
              showConfirmation(
                "Host Game",
                "Are you sure you want to host this game?",
                "success",
                () => {
                  // Trigger host logic here
                }
              )
            }
          >
            Host
          </Button>
          <Button variant="secondary" onClick={null}>
            View Past Results
          </Button>
          <Link to={`/game/${selectedGame?.gameId}`}>
            <Button variant="primary" style={{ width: "100%" }}>
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
                () => deleteGame()
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
