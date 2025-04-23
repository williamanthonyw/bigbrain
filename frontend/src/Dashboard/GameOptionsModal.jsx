import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

function GameOptionsModal({
  selectedGame,
  setSelectedGame,
  showConfirmation,
  deleteGame,
}) {
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
                  // Trigger your host logic here
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
            <Button variant="primary" style={{ width: "100%" }} onClick={null}>
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
