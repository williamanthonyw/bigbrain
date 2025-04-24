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
import SessionInProgress from "./SessionInProgress";
import SessionResults from "./SessionResults";

function Session(props) {
  const { sessionId } = useParams();
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

  // run once on load
  useEffect(() => {
    if (sessionId) fetchStatus();
  }, [sessionId]);

  // check for new players every second while in lobby
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
      <h1 className="text-white">Session {sessionId}</h1>
      {sessionStatus.active === true ? (
        sessionStatus.position === -1 ? (
          <SessionLobby sessionStatus={sessionStatus} />
        ) : (
          <SessionInProgress sessionStatus={sessionStatus} />
        )
      ) : (
        <SessionResults sessionStatus={sessionStatus} />
      )}
    </BackgroundWrapper>
  );
}

export default Session;
