import { Container, Button} from "react-bootstrap";
import brainImg from './assets/brain.png';
import { useNavigate, Link } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/play');
  }

  return (
    <>
      <style>
        {`
          .form-input::placeholder {
            color: #b9bbbe;
            opacity: 1;
          }
        `}
      </style>
      <div className="d-flex flex-column vh-100 justify-content-center align-items-center position-relative" style={{ background: "linear-gradient(145deg, #2c2f33, #23272a)" }}>
        <img src={brainImg} alt="Brain Logo" className="mb-3" style={{ width: "80px", height: "80px" }} />
        <h1 className="mb-5 text-white">BigBrain</h1>
        <Container className="text-center p-5 rounded shadow" style={{ maxWidth: '500px', backgroundColor: "#36393f", color: "white",}}>
          <Button variant="primary" type="submit" className="w-100" style={{ backgroundColor: "#7289da", border: "none" }} onClick={handleStartGame}>Start Game</Button>
        </Container>
        <Link to="/login" className="text-white mt-4" style={{ position: "absolute", bottom: "20px", textDecoration: "underline", fontSize: "0.9rem" } }>Create your own game</Link>
      </div>
    </>
  );
}

export default Home;