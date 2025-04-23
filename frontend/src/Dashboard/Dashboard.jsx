import { useEffect, useState } from "react";
import axios from "axios";
import brainImg from "../assets/brain.png";
import { Alert, Button, Card, Fade, Modal } from "react-bootstrap";
import GameList from "./GameList";
import NewGameModal from "./NewGameModal";
import GameOptionsModal from "./GameOptionsModal";

function Dashboard(props) {
  const token = props.token;
  const [games, setGames] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    title: "",
    message: "",
    variant: "",
    onConfirm: null,
  });
  const [selectedGame, setSelectedGame] = useState(null);
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("http://localhost:5005/admin/games", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${props.token}`,
          },
        });
        console.log(response.data);
        setGames(response.data.games);
      } catch (error) {
        console.error("Error fetching games: ", error);
      }
    };
    fetchGames();
  }, []);

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

  const showConfirmation = (title, message, variant, onConfirm) => {
    setConfirmDialog({
      show: true,
      title,
      message,
      variant,
      onConfirm,
    });
  };

  return (
    <>
      <div
        className="d-flex flex-column align-items-center vh-100"
        style={{ background: "linear-gradient(145deg, #2c2f33, #23272a)" }}
      >
        <img
          src={brainImg}
          alt="Brain Logo"
          className="mt-2 mb-3"
          style={{ width: "80px", height: "80px" }}
        />
        <h1 className="mb-4 text-white">Dashboard</h1>
        <Button
          variant="danger"
          onClick={props.logout}
          style={{ position: "absolute", top: "20px", right: "20px" }}
        >
          Logout
        </Button>
        <h2 className="mb-4 text-white">Active Game Sessions</h2>
        <div className="container-fluid mb-5" style={{ overflowX: "auto" }}>
          <div className="d-flex flex-row flex-nowrap">
            <Card style={{ minHeight: "10rem", minWidth: "10rem" }}>Hi</Card>
            <Card style={{ minHeight: "10rem", minWidth: "10rem" }}>Hi</Card>
            <Card style={{ minHeight: "10rem", minWidth: "10rem" }}>Hi</Card>
          </div>
        </div>
        <h2 className="mb-4 text-white">All Games</h2>
        <GameList
          games={games}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
          setSelectedGame={setSelectedGame}
          openNewGameModal={() => {
            setShowNewGameModal(true);
          }}
        />
      </div>
      <NewGameModal
        token={token}
        show={showNewGameModal}
        onHide={() => {
          setShowNewGameModal(false);
        }}
        setShowNewGameModal={setShowNewGameModal}
        setGames={setGames}
        setShowSuccessAlert={setShowSuccessAlert}
        setShowErrorAlert={setShowErrorAlert}
        setErrorMessage={setErrorMessage}
      />
      <GameOptionsModal
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        showConfirmation={showConfirmation}
        deleteGame={deleteGame}
      />
      <Modal
        show={confirmDialog.show}
        onHide={() => setConfirmDialog({ ...confirmDialog, show: false })}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{confirmDialog.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmDialog.message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setConfirmDialog({ ...confirmDialog, show: false })}
          >
            Cancel
          </Button>
          <Button
            variant={confirmDialog.variant}
            onClick={() => {
              confirmDialog.onConfirm();
              setConfirmDialog({ ...confirmDialog, show: false });
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <Fade in={showSuccessAlert}>
        <div>
          <Alert
            variant="success"
            className="position-fixed top-0 start-50 translate-middle-x mt-3"
            style={{ zIndex: 1051 }}
            dismissible
            onClose={() => setShowSuccessAlert(false)}
          >
            Game created successfully!
          </Alert>
        </div>
      </Fade>
      <Fade in={showErrorAlert}>
        <div>
          <Alert
            variant="danger"
            className="position-fixed top-0 start-50 translate-middle-x mt-3"
            style={{ zIndex: 1051 }}
            dismissible
            onClose={() => setShowErrorAlert(false)}
          >
            <strong>Error:</strong> {errorMessage}
          </Alert>
        </div>
      </Fade>
    </>
  );
}

export default Dashboard;
