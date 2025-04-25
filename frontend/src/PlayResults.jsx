import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function PlayResults(){

  const { sessionId, playerId } = useParams();
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
      
    const fetchResults = async () => {

      try {
        const response = await axios.get(`http://localhost:5005/play/${playerId}/results`, {
          headers: {
            Accept: 'application/json'
          }
        });

        console.log(response.data);
        setResults(response.data);
      }
      catch (err){
        console.error('Error fetching results', err);
      }
    }
    fetchResults();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-center align-items-center flex-column"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(145deg, #2c2f33, #23272a)",
          color: "#fff",
          padding: "2rem",
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            backgroundColor: "#2f3136",
            borderRadius: "16px",
            padding: "2rem 3rem",
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
            width: "100%",
            maxWidth: "600px"
          }}
        >
          <h1 style={{ fontSize: "2.5rem", color: "#7289da", marginBottom: "1rem" }}>
            🎉 Quiz Complete!
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#ccc", marginBottom: "2rem" }}>
            Here are your results:
          </p>
          {results && (
            results.map((res, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#36393f",
                  borderRadius: "10px",
                  padding: "1rem 1.5rem",
                  marginBottom: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span style={{ fontWeight: "500" }}>
                  Question {index + 1}
                </span>
                <span
                  style={{
                    fontWeight: "bold",
                    color: res.correct ? "limegreen" : "red",
                    fontSize: "1.2rem"
                  }}
                >
                  {res.correct ? "✅ Correct" : "❌ Incorrect"}
                </span>
              </div>
            ))
          )}
          

          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-outline-light"
              onClick={() => navigate("/")}
              style={{ borderColor: "#7289da", color: "#7289da" }}
            >
              🏠 Back to Home
            </button>
            <button
              className="btn btn-outline-light"
              onClick={() => navigate(`/play/${sessionId}/${playerId}`)}
              style={{ borderColor: "#99aab5", color: "#99aab5" }}
            >
              🔁 Play Again
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PlayResults;