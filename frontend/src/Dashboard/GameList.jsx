import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Placeholder,
} from "react-bootstrap";
import GameCard from "./GameCard";

function GameList({ games, setSelectedGame, openNewGameModal }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="container-fluid" style={{ overflowX: "auto" }}>
      <div className="d-flex flex-row flex-nowrap">
        <Button
          variant="primary"
          className="me-2"
          style={{ minHeight: "12rem", width: "10rem", minWidth: "10rem" }}
          onClick={openNewGameModal}
        >
          Create new game ✏️
        </Button>
        {games !== null // sort by most recently created
          ? games
            .sort((a, b) => b.dateCreated - a.dateCreated)
            .map((game, index) => (
              <GameCard
                key={index}
                game={game}
                onClick={() => setSelectedGame(game)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                isHovered={hoveredIndex === index}
              />
            ))
          : [...Array(3)].map((e, i) => (
            <span key={i}>
              <Card style={{ minHeight: "12rem", minWidth: "10rem" }}>
                <CardBody>
                  <Placeholder as={CardTitle} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>
                  <Placeholder as={CardText} animation="glow">
                    <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                    <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                    <Placeholder xs={8} />
                  </Placeholder>
                </CardBody>
              </Card>
            </span>
          ))}
      </div>
    </div>
  );
}

export default GameList;
