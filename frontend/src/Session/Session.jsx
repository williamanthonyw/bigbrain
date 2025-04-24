import { useParams } from "react-router-dom";
import { BackgroundWrapper, SiteLogo } from "../CommonComponents";

function Session(props) {
  const { sessionId} = useParams();
  return (
    sessionId
  );
};

export default Session;