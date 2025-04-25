import { Container, Button} from "react-bootstrap";
import brainImg from './assets/brain.png';
import { useNavigate, Link } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/play');
  };

  return (
    <>
      <style>
        {`
          .form-input::placeholder {
            color: #b9bbbe;
            opacity: 1;
          }

          .home-container {
            padding: 2rem;
            max-width: 600px;
            width: 100%;
          }

          .home-logo {
            width: 80px;
            height: 80px;
          }

          .home-title {
            font-size: 2rem;
          }

          @media (max-width: 500px) {
            .home-container {
              padding: 1.5rem;
              max-width: 90vw;
            }

            .home-title {
              font-size: 1.5rem;
            }

            .home-button {
              font-size: 1.1rem;
              padding: 0.75rem 1rem;
            }
          }
        `}
      </style>

      <div
        className="d-flex flex-column justify-content-center align-items-center vh-100"
        style={{
          background: "linear-gradient(145deg, #2c2f33, #23272a)",
          padding: "1rem",
        }}
      >
        <div className="home-container text-center bg-dark rounded shadow-lg text-white">
          <img src={brainImg} alt="Brain Logo" className="home-logo mb-3" />
          <h1 className="home-title mb-4">BigBrain</h1>

          <Button
            variant="primary"
            className="w-100 home-button"
            style={{
              backgroundColor: "#7289da",
              border: "none",
            }}
            onClick={handleStartGame}
          >
            Start Game
          </Button>
        </div>

        <Link
          to="/login"
          className="text-white mt-4"
          style={{
            textDecoration: "underline",
            fontSize: "0.9rem",
          }}
        >
          Create your own game
        </Link>
      </div>
    </>
  );
}

export default Home;
