import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";

const funFacts = [
  "The first video game was created in 1958!",
  "Nintendo was founded in 1889 — as a playing card company!",
  "Minecraft was created in just 6 days.",
  "The best-selling game ever is Tetris (almost 500M copies).",
  "Pac-Man was designed to appeal to women.",
  "Mario’s name came from Nintendo’s office landlord!",
  "Sonic originally had a human girlfriend named Madonna.",
  "The voice of Mario also voiced Parthenax in Skyrim.",
  "A man legally changed his name to 'PlayStation 2'.",
  "There’s a monument in Poland dedicated to Witcher.",
  "BigBrain Fact: Smart guesses can still earn points!",
  "The Game Boy survived a bombing in the Gulf War.",
  "Space Invaders was so popular it caused a coin shortage.",
  "Pokémon was inspired by the creator’s bug-collecting hobby.",
  "There’s a Doom port that runs on a pregnancy test.",
  "In Skyrim, you can marry a dog. Kind of.",
  "Halo's Master Chief is 7 feet tall in armor.",
  "The longest video game cutscene is over 8 hours!",
  "The Konami Code: ↑↑↓↓←→←→BA",
  "You can’t die in the original Sims without a player’s help.",
  "More people play games than watch Netflix daily.",
  "Some e-sports players retire before age 25.",
  "Overwatch was born from a canceled MMO project.",
  "Speedrunning Mario is an Olympic-level skill.",
  "BigBrain players are 42% more awesome. 😉",
  "Typing of the Dead is literally Doom but typing.",
  "There’s a video game museum inside Minecraft.",
  "An AI once beat the world champion at StarCraft II.",
  "Every copy of Animal Crossing has a unique town tune.",
  "World of Warcraft once had a real pandemic simulation.",
  "You can play Snake on YouTube (pause → press ←).",
  "Portal’s cake is not a lie. There’s a cake recipe in the code.",
  "Game devs hide their cats in code comments.",
  "The PlayStation logo has 3D depth — try squinting!",
  "Mario’s mustache is pixels saving animation budget.",
  "The BigBrain team drinks 3 coffees per trivia round.",
  "Cuphead’s animations were drawn frame-by-frame by hand.",
  "Lara Croft was originally called Laura Cruz.",
  "There’s a hidden cow level in Diablo. Moo.",
  "Game testers play the same level 1000+ times.",
  "Splatoon characters were almost rabbits!",
  "There’s a working Tetris on a business card.",
  "Among Us was out for 2 years before going viral.",
  "There's a goat simulation game — and it's glorious.",
  "You can pet the dog in BigBrain. Probably.",
  "Game facts like this make loading screens fun!",
  "Game devs love hiding bananas in their games.",
  "Games improve memory, focus, and multitasking.",
  "You’ve now read more than 5 facts. You’re winning.",
];

function FunFact() {
  const [factIndex, setFactIndex] = useState(Math.floor(Math.random() * funFacts.length));
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setFactIndex(Math.floor(Math.random() * funFacts.length));
        setFadeIn(true);
      }, 500);
    }, 5000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "30px",
        left: "50%",
        padding: "1rem 2rem",
        backgroundColor: "#2c2f33",
        borderRadius: "10px",
        color: "#fff",
        fontStyle: "italic",
        fontSize: "0.95rem",
        textAlign: "center",
        maxWidth: "90vw",
        borderLeft: "4px solid #7289da",
        boxShadow: "0 0 10px rgba(114, 137, 218, 0.3)",
        opacity: fadeIn ? 1 : 0,
        transform: `translateX(-50%) translateY(${fadeIn ? "0px" : "10px"})`,
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {funFacts[factIndex]}
    </div>
  );
}

function WaitingDotsText({ text }) {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4); // cycle: 0 → 1 → 2 → 3 → 0
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontSize: "1.5rem" }}>
      {text}<span>{".".repeat(dotCount)}</span>
    </div>
  );
}

function isYouTubeUrl(url) {
  return /youtu\.?be/.test(url);
}

function getYouTubeEmbedUrl(url) {
  try {
    const yt = new URL(url);
    if (yt.hostname.includes('youtube.com')) {
      return `https://www.youtube.com/embed/${yt.searchParams.get('v')}`;
    } else if (yt.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${yt.pathname.slice(1)}`;
    }
  } catch (err) {
    return '';
  }
}




function PlayGame(){

  const { sessionId, playerId } = useParams();
  const [gameStarted, setGameStarted] = useState(false);
  const [question, setQuestion] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  const handleUserAnswer = async (index) => {
    let updatedAnswers = [];

    if (question.type === 'single' || question.type === 'judgement') {
      updatedAnswers = [index];
      setUserAnswers(updatedAnswers);
    } else if (question.type === 'multiple') {
      updatedAnswers = userAnswers.includes(index) 
        ? userAnswers.filter((i) => i !== index)
        : [...userAnswers, index];
      setUserAnswers(updatedAnswers);
    }
    try{
      await axios.put(`http://localhost:5005/play/${Number(playerId)}/answer`, {
        answers: updatedAnswers
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log("Answer submitted: ", updatedAnswers);
    }
    
    catch (err){
      console.log("Error submitting answers ", err);
    }
    

  };

  useEffect(() => {
    if (!gameStarted || timeRemaining > 0) return;
  
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`http://localhost:5005/play/${playerId}/question`, {
          headers: { Accept: 'application/json' }
        });
  
        const newQuestion = response.data.question;
  
        if (!question || newQuestion.id !== question.id) {
          setQuestion(newQuestion);
          setTimeRemaining(newQuestion.duration);
          setUserAnswers([]);
          setCorrectAnswers([]);
        }
      } catch (err) {
        console.error('Error polling for next question:', err);
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [gameStarted, timeRemaining, question, playerId]);

  useEffect(() => {
    if (!gameStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0) ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0) {
      clearInterval();
    }
  }, [timeRemaining]);

  useEffect(() => {
    const checkGameStatus = async () => {
      try{
        const response = await axios.get(`http://localhost:5005/play/${playerId}/status`, {
          headers: {
            Accept: 'application/json'
          }
        });

        setGameStarted(response.data.started);
      }
      catch (err){
        console.error('Error fetching game status', err);
      }
    };

    const interval = setInterval(checkGameStatus, 1000);
    return () => clearInterval(interval);
  }, [playerId]);

  useEffect(() => {
    if (!gameStarted || timeRemaining !== 0 || !playerId) return;

    if (timeRemaining === 0){
      const fetchCorrectAnswers = async () => {
        try {
          const response = await axios.get(`http://localhost:5005/play/${Number(playerId)}/answer`, {
            headers: {
              Accept: 'application/json'
            }
          });

          console.log(response);

          setCorrectAnswers(response.data.answers);

        }
        catch (err){
          console.error("Error fetching correct answers", err);
        }
      } 
      fetchCorrectAnswers();
    }
     
  }, [gameStarted, timeRemaining, playerId]);

  return(
    
    <>
      <style>
        {`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spin-rev {
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        div[style*="spin"],
        div[style*="spin-rev"],
        div[style*="pulse"] {
          transform-origin: center;
        }
        `}
      </style>
      <div className="d-flex justify-content-center align-items-center flex-column" style={{  background: "linear-gradient(145deg, #2c2f33, #23272a)", color: "white", minHeight: "100vh", textAlign: 'center', padding: "2rem", position: 'relative'}}>
        { gameStarted && question && question.answers? (
          timeRemaining > 0 ? (
            <>
              <h1 className="mb-5" style={{ fontSize: "3.5rem", marginBottom: "1rem", position: 'relative', top: "30px"}}>{question.title}</h1>
              <div style={{ position: 'absolute', top: "30px", right: "30px", backgroundColor: "#7289da", color: "white", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontWeight: 'bold', fontSize: '1.5rem', boxShadow: "0 0 8px rgba(0,0,0,0.2)"}}>{timeRemaining}</div>
              
              <div className="mt-5 mb-4 text-center"
                style={{ 
                  width: '400px',
                  height: '300px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                {question.media ? (
                  isYouTubeUrl(question.media) ? ( 
                    <iframe
                      src={getYouTubeEmbedUrl(question.media)}
                      title="YouTube video"
                      allowFullScreen
                      style={{ width: '100%', height: '100%', border: 'none' }}
                    />

                  ) : (
                    <img
                      src={question.media}
                      alt="Media"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
                  )
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#23272a',
                    }}
                  >
                    <i className="bi bi-image" style={{ fontSize: '3rem', color: '#666' }}></i>
                  </div>
                )}
              </div>
              
              {(question.type === 'single' || question.type === 'multiple') && (
                <div className="mb-5">
                  <Form.Label className="text-white mb-4">
                    {question.type === 'single' ? 'Choose One' : 'Choose One or More'}
                  </Form.Label>
                  {question.answers.map((answer, index) => (
                    <div key={index} className="d-flex align-items-center mb-4">
                      <Form.Check
                        type={question.type === 'single' ? 'radio' : 'checkbox'}
                        name="userAnswer"
                        checked={question.type.includes(index)}
                        onChange={() => handleUserAnswer(index)}
                        className="me-2"
                      />
                      <Form.Control
                        type="text"
                        value={answer}
                        disabled
                        className="bg-dark text-white border-secondary"
                      />
                    </div>
                  ))}
                </div>
              )}

              {question.type === 'judgement' && (
                <div className="mt-5">
                  <Form.Label className="text-white mb-4">Select True or False</Form.Label>
                  <div className="d-flex align-items-center mb-3">
                    <Form.Check
                      type="radio"
                      name="userAnswer"
                      checked={userAnswers.includes(0)}
                      onChange={() => handleUserAnswer(0)}
                      className="me-2"
                    />
                    <Form.Control
                      type="text"
                      value="True"
                      disabled
                      className="bg-dark text-white border-secondary"
                    />
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <Form.Check
                      type="radio"
                      name="userAnswer"
                      checked={userAnswers.includes(1)}
                      onChange={() => handleUserAnswer(1)}
                      className="me-2"
                    />
                    <Form.Control
                      type="text"
                      value="False"
                      disabled
                      className="bg-dark text-white border-secondary"
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mt-5">
                <Form.Label className="text-white mb-4">Answers</Form.Label>
                { question.answers.map((answer, index) => {
                  const isCorrect = correctAnswers.includes(index);
                  const userChosen = userAnswers.includes(index);
                  const isWrong = userChosen && !isCorrect;
                  
                  return (
                    <div key={index} className="d-flex align-items-center mb-3">
                      <Form.Check type="checkbox" checked={userChosen} disabled className="me-2"/>
                      <Form.Control type="text" value={answer} disabled className="bg-dark text-white border-secondary me-2"/>
                      { isCorrect && (
                        <span style={{ color: 'limegreen', fontSize: '1.5rem' }}>✓</span>
                      )}
                      { isWrong && (
                        <span style={{ color: 'red', fontSize: '1.5rem' }}>✗</span>
                      )}
                    </div>
                  )
                })}
                <WaitingDotsText text="Waiting for host to advance"/>
              </div>

            </>
          )
         
        ) : (
          <>
            <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem", position: 'absolute', top: "30px", left: '50%', transform: "translateX(-50%)"}}>Lobby</h1>
            <div style={{ display: "flex", flexDirection: "column",alignItems: "center", gap: "1rem" }}>
              <div style={{ position: "relative",width: "50px",height: "50px", animation: "pulse 1.8s ease-in-out infinite",}}>
                <div style={{ boxSizing: "border-box",position: "absolute",width: "100%",height: "100%",border: "5px solid #7289da",borderTopColor: "transparent",borderRadius: "50%",animation: "spin 2s linear infinite" }}/>
                <div style={{ boxSizing: "border-box", position: "absolute",width: "100%",height: "100%",border: "5px solid #99aab5",borderBottomColor: "transparent",borderRadius: "50%",animation: "spin-rev 3s linear infinite" }}/>
              </div>
              <WaitingDotsText text="Waiting for host to start"/>
              <FunFact/>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default PlayGame;