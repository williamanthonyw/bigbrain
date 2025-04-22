import brainImg from './assets/brain.png';
import { Button } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Temp(props){

  const [games, setGames] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

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

    // const interval = setInterval(() => {
    //   fetchGames();
    // }, 5000); 

    // return () => clearInterval(interval);
  }, []);

  const handleGameClick = (game) =>{
    console.log(game);
    navigate(`/game/${game.id}`)
  }

  return (
    <>
      <div style={{ background: "linear-gradient(145deg, #2c2f33, #23272a)", minHeight: "100vh", position: "relative" }}>
        <Button variant='danger' onClick={props.logout} style={{ position: "absolute", top: "20px", right: "20px" }}>Logout</Button>
        <div className="d-flex justify-content-center align-items-center pt-4">
          <img src={brainImg} alt="Brain Logo" style={{ width: "80px", height: "80px", marginRight: "15px" }} /> 
          <h1 className="pt-4 text-white text-center">Dashboard</h1>
          <img src={brainImg} alt="Brain Logo" style={{ width: "80px", height: "80px", marginLeft: "15px" }} /> 
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(145deg, #2c2f33, #23272a" }}>
          <h2 className='text-white mb-4'>Admin Games</h2>
          {games.length > 0 ? (
            games.map((game, index) => (
              <div key={index} onClick={() => handleGameClick(game)}  
                onMouseEnter={() => setHoveredIndex(index)} 
                onMouseLeave={() => setHoveredIndex(null)} 
                className="game-box text-white w-100 text-center" 
                style={{
                  backgroundColor: hoveredIndex === index ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  borderRadius: '10px',
                  padding: '15px 25px',
                  marginBottom: '10px',
                  transition: 'background-color 0.3s',
                  cursor: 'pointer'
                }}>
                {game.title || `Game ${index + 1}`}
              </div>
            ))
          ) : (
            <p className="text-white">No games found or still loading...</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Temp