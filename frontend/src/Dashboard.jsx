import { useState } from 'react';
import axios from 'axios';
import brainImg from './assets/brain.png';
import { Alert, Button, Fade, Form, FormControl, FormGroup, FormLabel, Modal } from "react-bootstrap";

function Dashboard(props){
  const token = props.token;
  const [newTitle, setNewTitle] = useState("");
  const [newThumbnail, setNewThumbnail] = useState("");
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const openNewGameModal = () => {
    setShowNewGameModal(true);
  };

  const closeNewGameModal = () => {
    setShowNewGameModal(false);
  };

  const handleNewGameModalExited = () => {
    setNewTitle("");
    setNewThumbnail("");
    setValidated(false);
  }

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      setNewThumbnail(reader.result); // base64 string as thumbnail
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // ID generation copied from backend/src/service.js
  const randNum = (max) =>
    Math.round(
      Math.random() * (max - Math.floor(max / 10)) + Math.floor(max / 10)
    );
  const generateId = (currentList, max = 999999999) => {
    let R = randNum(max);
    while (currentList.includes(R)) {
      R = randNum(max);
    }
    return R.toString();
  };

  const createGame = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    // block submission if input is invalid (eg name field is empty)
    setValidated(true);
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    try{
      // get full list of games, append new game then put
      let response = await axios.get('http://localhost:5005/admin/games', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const games = response.data.games;
      const newGameId = generateId(games.map(game => game.gameId), 999999);
      const newGame = {
        gameId: newGameId,
        owner: localStorage.getItem("email"),
        name: newTitle,
        thumbnail: newThumbnail,
        questions: []
      };
      const updatedGames = [...games, newGame];

      response = await axios.put('http://localhost:5005/admin/games', {
        games: updatedGames
      }, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      if (response.status === 200) {
        setShowNewGameModal(false);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
    }

    catch (err){
      console.error("Error creating game: ", err);
      const msg = err.response?.data?.error || err.message || "Something went wrong :c";
      setErrorMessage(msg);
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 5000);
    }
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(145deg, #2c2f33, #23272a" }}>
        <img src={brainImg} alt="Brain Logo" className="mb-3" style={{ width: "80px", height: "80px" }} />
        <h1 className="mb-4 text-white">Dashboard</h1>
        <Button variant='danger' onClick={props.logout} style={{ position: "absolute", top: "20px", right: "20px" }}>Logout</Button>
        <Button variant="primary" size="sm" onClick={openNewGameModal}>
          Create new game ✏️
        </Button>
      </div>
      <Modal show={showNewGameModal} onHide={closeNewGameModal} onExited={handleNewGameModalExited} centered>
        <Form noValidate validated={validated} onSubmit={createGame}>
          <Modal.Header closeButton>
            <Modal.Title>Create new game ✏️</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <FormLabel>Name</FormLabel>
              <FormControl
                required
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter a name for your game."
              />
              <div className="invalid-feedback">Please choose a name.</div>
            </FormGroup>
            <FormGroup>
              <FormLabel>Thumbnail (optional)</FormLabel>
              <FormControl
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeNewGameModal}>Cancel</Button>
            <Button variant="success" type="submit">Create</Button>
          </Modal.Footer>
        </Form>
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

export default Dashboard