import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function SessionResults(props) {
  const { sessionId } = useParams();

  const [results, setResults] = useState(null);
  // update the results once on component mount
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5005/admin/session/${sessionId}/results`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${props.token}`,
            },
          }
        );
        setResults(response.data.results);
        calculateScores(response.data.results);
      } catch (error) {
        console.error("Error fetching session status:", error);
      }
    };
    fetchResults();
  }, []);

  const calculateScores = (results) => {};

  return (
    <>
      <h2 className="text-white">Results</h2>
      <p>{JSON.stringify(results)}</p>
    </>
  );
}

export default SessionResults;
