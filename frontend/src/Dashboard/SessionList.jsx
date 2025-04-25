import { Card, CardBody, CardText, CardTitle } from "react-bootstrap";
import { Placeholder } from "react-bootstrap";
import SessionCard from "./SessionCard";

function SessionList({ games, onClick }) {
  return (
    <div
      className="container-fluid"
      style={{ minHeight: "12rem", overflowX: "auto" }}
    >
      <div
        className="d-flex flex-row flex-nowrap justify-content-center justify-content-sm-start"
        style={{ width: "max-content", margin: "0 auto" }}
      >
        {games !== null ? (
          games.filter((game) => game.active && game.active !== null).length !==
          0 ? (
              games
                .filter((game) => game.active && game.active !== null)
                .sort((a, b) => b.dateCreated - a.dateCreated)
                .map((game, index) => (
                  <SessionCard
                    key={index}
                    game={game}
                    onClick={() => onClick(game)}
                  />
                ))
            ) : (
              <p className="text-white">No active sessions!</p>
            )
        ) : (
          [...Array(3)].map((e, i) => (
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
          ))
        )}
      </div>
    </div>
  );
}

export default SessionList;
