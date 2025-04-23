import { useEffect, useState } from 'react';
import axios from 'axios';
import brainImg from './assets/brain.png';
import { Alert, Button, Card, CardBody, CardText, CardTitle, Fade, Form, FormControl, FormGroup, FormLabel, Modal, Placeholder } from "react-bootstrap";

function Dashboard(props){
  const token = props.token;
  const [games, setGames] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newThumbnail, setNewThumbnail] = useState("");
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:5005/admin/games', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${props.token}`
          }
        });
        console.log(response.data);
        setGames(response.data.games);
      }
      catch (error){
        console.error('Error fetching games: ', error);
      }
    };
    fetchGames();
  }, []);

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
        title: newTitle,
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
        setGames(updatedGames);
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
      <div className="d-flex flex-column align-items-center vh-100" style={{ background: "linear-gradient(145deg, #2c2f33, #23272a)" }}>
        <img src={brainImg} alt="Brain Logo" className="mt-2 mb-3" style={{ width: "80px", height: "80px" }} />
        <h1 className="mb-4 text-white">Dashboard</h1>
        <Button variant='danger' onClick={props.logout} style={{ position: "absolute", top: "20px", right: "20px" }}>Logout</Button>
        <h2 className="mb-4 text-white">Active Game Sessions</h2>
        <div className="container-fluid mb-5" style={{ overflowX: "auto"}}>
          <div className="d-flex flex-row flex-nowrap">
            <Card style={{minHeight: "10rem", minWidth: "10rem"}}>Hi</Card>
            <Card style={{minHeight: "10rem", minWidth: "10rem"}}>Hi</Card>
            <Card style={{minHeight: "10rem", minWidth: "10rem"}}>Hi</Card>
          </div>
        </div>
        <h2 className="mb-4 text-white">All Games</h2>
        <div className="container-fluid" style={{ overflowX: "auto"}}>
          <div className="d-flex flex-row flex-nowrap">
            <Button variant="primary" className="me-2" style={{minHeight: "10rem", width: "10rem", minWidth: "10rem"}} onClick={openNewGameModal}>
              Create new game ✏️
            </Button>
            {games !== null ? (
              games.map((game, index) => (
                <Card key={index} className="me-2" style={{minHeight: "10rem", minWidth: "10rem"}}>
                  <CardBody>
                    <CardTitle>{game.title || `Game ${game.gameId}`}</CardTitle>
                  </CardBody>
                </Card>
              ))
            ) : (
              <Card style={{minHeight: "10rem", minWidth: "10rem"}}>
                <CardBody>
                  <Placeholder as={CardTitle} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>
                  <Placeholder as={CardText} animation="glow">
                    <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                    <Placeholder xs={6} /> <Placeholder xs={8} />
                  </Placeholder>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
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