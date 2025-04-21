import brainImg from './assets/brain.png';
import { Button, Modal } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function GameDetails(props){
  const token = props.token;
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [newTitle, setNewTitle] = useState(game?.title || "");
  const [showModal, setShowModal] = useState(false);

  const openTitleModal = () => {
    setNewTitle(game.title);
    setShowModal(true);
  };

  const closeTitleModal = () => {
    setShowModal(false);
  };

  const saveTitle = async () => {

  };



  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get('http://localhost:5005/admin/games', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }});

        const findGame = response.data.games.find(game => game.id == id);

        if (findGame){
          setGame(findGame);
        }
        else{
          console.error('Game not found with id:', id);
        }

      }

      catch (err){
        console.error('Error fetching games', err);
      }
    };
    fetchGame();
  }, []);

  const goBack = () => {
    console.log('clicked');
    console.log(props.token);
    if (props.token){
      navigate('/temp');
    }
  };

  return (
    <>
      <div style={{ background: "linear-gradient(145deg, #2c2f33, #23272a)", minHeight: "100vh", position: "relative", color: "white", paddingTop: '80px' }}>
        <Button variant='danger' onClick={props.logout} style={{ position: "absolute", top: "20px", right: "20px" }}>Logout</Button>
        <Button variant='light' onClick={goBack} style={{ position: "absolute", top: "20px", left: "20px" }}> ← Back</Button>
        {game ? (
          <div className='mt-5 text-center d-flex justify-content-center align-items-center gap-2'>
            <h2 className='m-0'>{game.title}</h2>
            <Button variant="outline-none" size="sm" onClick={openTitleModal}>✏️</Button>
          </div>
        ) : (
          <p className="mt-5 text-center">Loading game...</p>
        )}
      </div>

      <Modal show={showModal} onHide={closeTitleModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Game Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter new game title"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={closeTitleModal}>Cancel</Button>
          <Button variant="primary" onClick={saveTitle}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GameDetails;