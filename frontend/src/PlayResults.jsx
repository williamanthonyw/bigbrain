import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function PlayResults(){

  const { sessionId, playerId } = useParams();
  const [results, setResults] = useState(null);
  const navigate = useNavigate();
  const questionPoints = JSON.parse(sessionStorage.getItem("questionPoints") || "[]");
  const questionDurations = JSON.parse(sessionStorage.getItem("questionDurations") || "[]");

  console.log(questionDurations);
  console.log(questionPoints);
  

  useEffect(() => {
      
    const fetchResults = async () => {

      try {
        const response = await axios.get(`http://localhost:5005/play/${playerId}/results`, {
          headers: {
            Accept: 'application/json'
          }
        });

        setResults(response.data);
        console.log(response.data);
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
          {results && results.map((res, index) =>  {
            const timeTaken = Math.round((new Date(res.answeredAt) - new Date(res.questionStartedAt)) / 1000);
            const pointsEarned = res.correct ? Math.round((questionPoints[index] + (((questionDurations[index]-timeTaken)/questionDurations[index]) * questionPoints[index])) * 10) / 10 || 0 : 0;

            return (
              <div
                key={index}
                style={{
                  backgroundColor: "#36393f",
                  borderRadius: "10px",
                  padding: "1rem 1.5rem",
                  marginBottom: "1rem",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {/* ✅ First Row */}
                <div className="d-flex justify-content-between align-items-center w-100 mb-2">
                  <span style={{ fontWeight: "500", fontSize: "1rem" }}>
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
          
                {/* ✅ Second Row */}
                <div className="d-flex justify-content-between w-100" style={{ color: "#bbb", fontSize: "0.95rem" }}>
                  <span>⏱ Time Taken: {timeTaken}s</span>
                  <span>🏆 Points Earned: {pointsEarned}</span>
                </div>
              </div>
            );
          })}
          
          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-outline-light"
              onClick={() => {
                sessionStorage.removeItem("questionPoints");
                sessionStorage.removeItem("questionDurations");
                navigate("/");
              }}
              style={{ borderColor: "#7289da", color: "#7289da" }}
            >
              🏠 Back to Home
            </button>
            <button
              className="btn btn-outline-light"
              onClick={() => {
                sessionStorage.removeItem("questionPoints");
                sessionStorage.removeItem("questionDurations");
                navigate(`/play`);
              }}
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