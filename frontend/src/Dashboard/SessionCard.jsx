import { useState } from "react";
import { Card, CardBody, CardImg, CardText, CardTitle } from "react-bootstrap";

function SessionCard({ game, onClick }) {
  const [hovered, setHovered] = useState(false);

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
        <CardText></CardText>
      </CardBody>
    </Card>
  );
}

export default SessionCard;
