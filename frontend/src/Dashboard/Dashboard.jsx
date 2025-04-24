import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button, Fade } from "react-bootstrap";
import { BackgroundWrapper, SiteLogo } from "../CommonComponents";
import GameList from "./GameList";
import NewGameModal from "./NewGameModal";
import GameOptionsModal from "./GameOptionsModal";
import ConfirmDialogModal from "./ConfirmDialogModal";
import SessionList from "./SessionList";
import SessionOptionsModal from "./SessionOptionsModal";

function Dashboard(props) {
  const token = props.token;
  const [games, setGames] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    title: "",
    message: "",
    variant: "",
    onConfirm: null,
  });
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedGameSession, setSelectedGameSession] = useState(null);
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
      <BackgroundWrapper>
        <SiteLogo className="mt-2 mb-3" />
        <h1 className="mb-4 text-white">Dashboard</h1>
        <Button
          variant="danger"
          onClick={props.logout}
          style={{ position: "absolute", top: "20px", right: "20px" }}
        >
          Logout
        </Button>
        <h2 className="mb-3 text-white">Active Game Sessions</h2>
        <SessionList games={games} onClick={setSelectedGameSession} />
        <h2 className="mt-4 mb-3 text-white">All Games</h2>
        <GameList
          games={games}
          onClick={setSelectedGame}
          openNewGameModal={() => {
            setShowNewGameModal(true);
          }}
        />
      </BackgroundWrapper>
      <SessionOptionsModal
        token={token}
        games={games}
        setGames={setGames}
        selectedGame={selectedGameSession}
        setSelectedGame={setSelectedGameSession}
        showConfirmation={showConfirmation}
        setErrorMessage={setErrorMessage}
        setShowErrorAlert={setShowErrorAlert}
      />
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
        token={token}
        games={games}
        setGames={setGames}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        setSelectedGameSession={setSelectedGameSession}
        showConfirmation={showConfirmation}
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
        setErrorMessage={setErrorMessage}
        setShowErrorAlert={setShowErrorAlert}
      />
      <ConfirmDialogModal
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
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
