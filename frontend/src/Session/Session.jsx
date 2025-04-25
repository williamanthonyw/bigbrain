import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  BackgroundWrapper,
  DashboardButton,
  LogoutButton,
  SiteLogo,
} from "../CommonComponents";
import SessionLobby from "./SessionLobby";
import SessionResults from "./SessionResults";

function Session(props) {
  const { sessionId } = useParams();
  const [game, setGame] = useState(null);
  const [sessionStatus, setSessionStatus] = useState(null);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5005/admin/session/${sessionId}/status`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${props.token}`,
          },
        }
      );
      setSessionStatus(response.data.results);
    } catch (error) {
      console.error("Error fetching session status:", error);
    }
  };

  const getGamefromSessionId = async () => {
    try {
      const response = await axios.get(`http://localhost:5005/admin/games`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${props.token}`,
        },
      });
      const games = response.data.games;
      // Find the game with the matching sessionId
      let game = games.find((game) => game.active == sessionId);
      // If not found, check oldSessions
      if (!game) {
        const oldSessions = games.flatMap((game) => game.oldSessions);
        game = oldSessions.find((oldSession) => oldSession == sessionId);
      }
      setGame(game);
    } catch (error) {
      console.error("Error fetching game ID:", error);
    }
  };

  // run once on load
  useEffect(() => {
    if (sessionId) fetchStatus();
    setGame(getGamefromSessionId());
  }, [sessionId]);

  // check for new players every second while in lobby
  // also trigger once each time the question changes
  useEffect(() => {
    if (!sessionStatus?.active || sessionStatus?.position !== -1) return;
    const interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);
  }, [sessionStatus?.position]);

  if (!sessionStatus) {
    return (
      <BackgroundWrapper>
        <SiteLogo className="mt-2 mb-3" />
        <h1 className="text-white">Loading...</h1>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <SiteLogo className="mt-2 mb-3" />
      <DashboardButton />
      <LogoutButton onClick={props.logout} />
      <h1>Session {sessionId}</h1>
      {sessionStatus.active === true ? (
        <SessionLobby
          token={props.token}
          game={game}
          sessionStatus={sessionStatus}
          setSessionStatus={setSessionStatus}
          fetchStatus={fetchStatus}
        />
      ) : (
        <SessionResults
          token={props.token}
          game={game}
          sessionStatus={sessionStatus}
        />
      )}
    </BackgroundWrapper>
  );
}

export default Session;
