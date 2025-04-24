import { useState } from "react";
import { Card, CardImg, CardBody, CardTitle, CardText } from "react-bootstrap";

function GameCard({ game, onClick }) {
  const [hovered, setHovered] = useState(false);

  const getGameDuration = (game) => {
    return game.questions.reduce(
      (cumDuration, currentQuestion) => cumDuration + currentQuestion.duration,
      0
    );
  };

  return (
    <Card
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="me-2"
      style={{
        cursor: "pointer",
        backgroundColor: hovered
          ? "rgba(255, 255, 255, 0.8)"
          : "rgba(255, 255, 255, 1.0)",
        transition: "background-color 0.3s",
        minHeight: "12rem",
        minWidth: "10rem",
        maxWidth: "10rem",
      }}
    >
      <CardImg
        variant="top"
        style={{ maxHeight: "4rem" }}
        src={game.thumbnail}
      />
      <CardBody>
        <CardTitle>{game.title || `Game ${game.gameId}`}</CardTitle>
        <CardText>
          {game.questions.length} questions
          <br />
          {getGameDuration(game)} seconds
        </CardText>
      </CardBody>
    </Card>
  );
}

export default GameCard;
