import { Button, Modal } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

function GameDetails(props){
  const token = props.token;
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [newTitle, setNewTitle] = useState(game?.title || "");
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showThumbnailModal, setShowThumbnailModal] = useState(false);
  const [newThumbnail, setNewThumbnail] = useState(game?.thumbnail || "");
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

  const openThumbnailModal = () => {
    setNewTitle(game.thumbnail);
    setShowThumbnailModal(true);
  };

  const closeThumbnailModal = () => {
    setShowThumbnailModal(false);
  };

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

  const saveThumbnail = async () => {
    try {
      const response = await axios.get('http://localhost:5005/admin/games', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
  
      const updatedGames = response.data.games.map(g => {
        if (g.id === game.id) {
          return { ...g, thumbnail: newThumbnail ? newThumbnail : null }; // ⬅️ Use the URL or base64 string
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
      });
  
      setGame(prev => ({ ...prev, thumbnail: newThumbnail ? newThumbnail : null}));
      setShowThumbnailModal(false);
    } catch (err) {
      console.error("Error updating thumbnail:", err);
    }
  };

  const removeThumbnail = async () => {

    const confirmed = window.confirm("Are you sure you want to remove the thumbnail?");
    if (!confirmed) return;
    try {
      const response = await axios.get('http://localhost:5005/admin/games', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
  
      const updatedGames = response.data.games.map(g => {
        if (g.id === game.id) {
          return { ...g, thumbnail: null };
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
      });
  
      setGame(prev => ({ ...prev, thumbnail: null }));
      setShowThumbnailModal(false);
    } catch (err) {
      console.error("Error removing thumbnail:", err);
    }
  };
  
  const addQuestion = async () => {
    try{
      const response = await axios.get('http://localhost:5005/admin/games', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      const existingIds = response.data.games.flatMap(g => g.questions?.map(q => q.id) || []);
      let id;
      do {
        id = Math.floor(1000000 + Math.random() * 9000000).toString();
      }   while (existingIds.includes(id));

      const newQuestion = {
        id: id,
        title: "",
        duration: 0,
        points: 0,
        media: "",
        correctAnswers: [],
        type: ""
      };

      const updatedGames = response.data.games.map(g => {
        if (g.id == game.id){
          return { ...g, questions: [...(g.questions || []), newQuestion]};
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
      });

      setGame(prev => ({ ...prev, questions: [...(prev.questions || []), newQuestion]}));
    }
    catch (err){
      console.error("Error adding question:", err);
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

  // if (game){
  //   console.log(game.questions);
  // }

  return (
    <>
      <div style={{ background: "linear-gradient(145deg, #2c2f33, #23272a)", minHeight: "100vh", display: 'flex', flexDirection:'column', position: "relative", color: "white", paddingTop: '80px' }}>
        <Button variant='danger' onClick={props.logout} style={{ position: "absolute", top: "20px", right: "20px" }}>Logout</Button>
        <Button variant='light' onClick={goBack} style={{ position: "absolute", top: "20px", left: "20px" }}> ← Back</Button>
        {game ? (
          <>
            <div className='mt-5 mb-5 text-center d-flex justify-content-center align-items-center gap-2' style={{ flexGrow: 1}}>
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

                <div
                  onClick={openThumbnailModal}
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
            <div className="mt-3"
              style={{
                width: 'fit-content',
                minHeight: '300px',
                margin: '0 auto',
                flexGrow: 1
              }}
            >
              {game.questions ? (
                game.questions.map((question, index) => (
                  <div key={index} className="mb-3 p-3 rounded" onClick={() => navigate(`/game/${game.id}/question/${question.id}`)}style={{
                    minWidth: "400px",
                    width: '50vw',
                    minHeight: "120px",
                    height: '10vh',
                    backgroundColor: '#2f3136',
                    color: '#dcddde',
                    border: '1px solid #444',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3a3d42'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2f3136'}>
                    <div className="mb-4"><strong style={{ fontSize: '1.5rem' }}>Question {index+1}</strong></div>
                    <div className="d-flex justify-content-between">
                      {question.type ? <div className="text-start">Type: {question.type}</div> : <div></div>}
                      {question.duration !== 0 ? <div className="text-end">Duration: {question.duration} seconds</div> : <div></div>}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ height: '20px' }}></div>
              )}
              <Button variant="primary" onClick={addQuestion} className="w-100">Add Question</Button>
            </div>   
          </>
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

      <Modal show={showThumbnailModal} onHide={closeThumbnailModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Thumbnail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleThumbnailFileChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={closeThumbnailModal}>Cancel</Button>
          <Button variant="secondary" onClick={removeThumbnail}>Remove</Button>
          <Button variant="primary" onClick={saveThumbnail}>Upload</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GameDetails;