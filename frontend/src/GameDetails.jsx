import { Button, Modal } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import defaultThumbnail from './assets/thumbnail.png';
import 'bootstrap-icons/font/bootstrap-icons.css';

function GameDetails(props){
  const token = props.token;
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [newTitle, setNewTitle] = useState(game?.title || "");
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showThumbnailModal, setShowThumbnailModal] = useState(false);
  const [newThumbnail, setNewThumbnail] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const openTitleModal = () => {
    setNewTitle(game.title);
    setShowTitleModal(true);
  };

  const closeTitleModal = () => {
    setShowTitleModal(false);
  };

  const saveTitle = async () => {
    try{
      const response = await axios.get('http://localhost:5005/admin/games', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const updatedGames = response.data.games.map(g => {
        if (g.id == game.id){
          return { ...g, title: newTitle};
        }
        return g;
      });

      await axios.put('http://localhost:5005/admin/games', {
        games: updatedGames
      }, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      setGame(prev => ({ ...prev, title: newTitle}));
      setShowTitleModal(false);
    }

    catch (err){
      console.error("Error updating title: ", err);
    }
  };



  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get('http://localhost:5005/admin/games', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

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
            <div className="position-relative ms-4"
              style={{
                width: '400px',
                height: '300px',
                overflow: 'hidden',
                display: 'inline-block',
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* If thumbnail exists, show image */}
              {game.thumbnail ? (
                <img
                  src={game.thumbnail}
                  alt="Thumbnail"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              ) : (
                // Default thumbnail icon fallback
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <i className="bi bi-image" style={{ fontSize: '200px', display: 'block', color: '#6c757d' }}></i>
                </div>
              )}

              {/* Hover overlay */}
              <div
                onClick={() => setShowThumbnailModal(true)}
                className="d-flex justify-content-center align-items-center"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                  cursor: 'pointer',
                  zIndex: 1,
                }}
              >
                <i className="bi bi-pencil-fill" style={{ fontSize: '80px', color: '#fff' }}></i>
              </div>
            </div>
          
          </div>
        ) : (
          <p className="mt-5 text-center">Loading game...</p>
        )}
      </div>

      <Modal show={showTitleModal} onHide={closeTitleModal} centered>
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