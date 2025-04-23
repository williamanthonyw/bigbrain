import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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

function WaitingDotsText() {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4); // cycle: 0 → 1 → 2 → 3 → 0
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontSize: "1.5rem" }}>
      Waiting for host to start<span>{".".repeat(dotCount)}</span>
    </div>
  );
}

function PlayGame(){

  const { sessionId, playerId } = useParams();
  const [gameStarted, setGameStarted] = useState(false);

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
      <div className="d-flex justify-content-center align-items-center flex-column" style={{  background: "linear-gradient(145deg, #2c2f33, #23272a)", color: "white", minHeight: "100vh", padding: "2rem"}}>
        { gameStarted ? (
          <>
            <h1>Game started</h1>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: "3rem", marginBottom: "1rem", position: 'absolute', top: "30px", left: '50%', transform: "translateX(-50%)"}}>Lobby</h1>
            <div style={{ display: "flex", flexDirection: "column",alignItems: "center", gap: "1rem" }}>
              <div style={{ position: "relative",width: "50px",height: "50px", animation: "pulse 1.8s ease-in-out infinite",}}>
                <div style={{ boxSizing: "border-box",position: "absolute",width: "100%",height: "100%",border: "5px solid #7289da",borderTopColor: "transparent",borderRadius: "50%",animation: "spin 2s linear infinite" }}/>
                <div style={{ boxSizing: "border-box", position: "absolute",width: "100%",height: "100%",border: "5px solid #99aab5",borderBottomColor: "transparent",borderRadius: "50%",animation: "spin-rev 3s linear infinite" }}/>
              </div>
              <WaitingDotsText/>
              <FunFact/>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default PlayGame;