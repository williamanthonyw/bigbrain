import axios from "axios";
import { useRef, useState } from "react";
import {
  Modal,
  Form,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
} from "react-bootstrap";
import verifyJSON from "./jsonUpload.js";

function NewGameModal({
  token,
  show,
  onHide,
  setShowNewGameModal,
  setGames,
  setShowSuccessAlert,
  setShowErrorAlert,
  setErrorMessage,
}) {
  const [newTitle, setNewTitle] = useState("");
  const [newThumbnail, setNewThumbnail] = useState("");
  const [validated, setValidated] = useState(false);
  const [questionFile, setQuestionFile] = useState(null);

  const JSONInputRef = useRef(null);

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

  const handleJSONFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      try {
        if (verifyJSON(reader.result)) {
          setQuestionFile(JSON.parse(reader.result));
        } else {
          // clear input if invalid JSON
          JSONInputRef.current.value = null;
          setQuestionFile(null);
          throw new Error("Invalid JSON format");
        }
      } catch (err) {
        console.error("Error reading JSON file: ", err);
        setShowErrorAlert(true);
        setErrorMessage("Invalid JSON file format.");
        setTimeout(() => setShowErrorAlert(false), 5000);
      }
    };
    if (file) {
      reader.readAsText(file);
    }
  };


  const handleNewGameModalExited = () => {
    setNewTitle("");
    setNewThumbnail("");
    setValidated(false);
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
    try {
      // get full list of games, append new game then put
      let response = await axios.get("http://localhost:5005/admin/games", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const games = response.data.games;
      const newGameId = generateId(
        games.map((game) => game.gameId),
        999999
      );
      const newGame = {
        gameId: newGameId,
        owner: localStorage.getItem("email"),
        dateCreated: Date.now(),
        title: newTitle,
        thumbnail: newThumbnail,
        questions: questionFile || [],
      };
      console.log("questions: ", questionFile);
      console.log("new game: ", newGame);
      const updatedGames = [...games, newGame];

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
        setShowNewGameModal(false);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
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
      show={show}
      onHide={onHide}
      onExited={handleNewGameModalExited}
      centered
    >
      <Form noValidate validated={validated} onSubmit={createGame}>
        <Modal.Header closeButton>
          <Modal.Title>Create new game ✏️</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup className="mb-3">
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
          <FormGroup className="mb-3">
            <FormLabel>Thumbnail (optional)</FormLabel>
            <FormControl
              type="file"
              accept="image/*"
              onChange={handleThumbnailFileChange}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Import Questions (optional)</FormLabel>
            <FormControl
              ref={JSONInputRef}
              type="file"
              accept=".json"
              onChange={handleJSONFileChange}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="success" type="submit">
            Create
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default NewGameModal;
