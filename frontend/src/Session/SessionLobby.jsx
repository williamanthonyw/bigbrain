import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  InputGroup,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

function SessionLobby(props) {
  const { sessionId } = useParams();
  const [showTooltip, setShowTooltip] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const sessionStatus = props.sessionStatus;
  const gameURL = `${window.location.origin}/play?pin=${sessionId}`;

  // update the question timer
  useEffect(() => {
    // exit if in lobby
    if (
      sessionStatus.position === -1 ||
      !sessionStatus.questions ||
      sessionStatus.position >= sessionStatus.questions.length
    )
      return;
    const question = sessionStatus.questions[sessionStatus.position];
    const startTime = new Date(sessionStatus.isoTimeLastQuestionStarted);
    const endTime = new Date(startTime.getTime() + question.duration * 1000);

    const updateCountdown = () => {
      const now = new Date();
      const diff = Math.max(0, (endTime - now) / 1000);
      setTimeLeft(diff);
    };

    updateCountdown(); // initial call
    const interval = setInterval(updateCountdown, 100);

    return () => clearInterval(interval);
  }, [sessionStatus.position, sessionStatus.isoTimeLastQuestionStarted]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(gameURL);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 1000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const mutateGame = async (mutationType) => {
    try {
      const response = await axios.post(
        `http://localhost:5005/admin/game/${props.game.id}/mutate`,
        {
          mutationType: mutationType,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${props.token}`,
          },
        }
      );
      if (response.status === 200) {
        const { status, position } = response.data.data;
        // update the game list with the new sessionId
        if (mutationType === "ADVANCE") {
          props.setSessionStatus({ ...sessionStatus, position: position });
        }
        // marginally slower: fetch status from server
        await props.fetchStatus();
      }
    } catch (err) {
      console.error("Error hosting game: ", err);
    }
  };

  return (
    <div style={{ maxWidth: "360px", width: "100%" }}>
      {sessionStatus.position === -1 ? (
        <>
          <h2>In Lobby</h2>
          <FormGroup>
            <FormLabel>Invite Link 📩</FormLabel>
            <InputGroup className="mb-3">
              <FormControl readOnly placeholder="URL" value={gameURL} />
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip className="copy-tooltip">Copied!</Tooltip>}
                show={showTooltip}
              >
                <Button variant="outline-secondary" onClick={copyToClipboard}>
                  <i className="bi bi-clipboard"></i>
                </Button>
              </OverlayTrigger>
            </InputGroup>
          </FormGroup>
        </>
      ) : (
        <>
          <h2>
            {`Question ${sessionStatus.position + 1}/${
              sessionStatus.questions.length
            }`}
          </h2>
          <h3
            style={{ marginBottom: "5.6rem" }}
          >{`Time remaining: ${timeLeft?.toFixed(1)}s`}</h3>
        </>
      )}
      <h3 style={{ marginTop: "3rem" }}>Players</h3>
      <ListGroup>
        {sessionStatus.players.length !== 0 ? (
          sessionStatus.players.map((player, index) => (
            <ListGroupItem key={index}>{player}</ListGroupItem>
          ))
        ) : (
          <ListGroupItem>{"No players yet!"}</ListGroupItem>
        )}
      </ListGroup>
      <Button
        variant="primary"
        style={{ width: "100%", marginTop: "20px" }}
        onClick={() => mutateGame("ADVANCE")}
      >
        {sessionStatus.position === -1 ? "Start Session" : "Next Question"}
      </Button>
      <Button
        variant="danger"
        style={{ width: "100%", marginTop: "10px" }}
        onClick={() => mutateGame("END")}
      >
        Stop Session
      </Button>
    </div>
  );
}
export default SessionLobby;
