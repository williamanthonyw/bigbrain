import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table, Tooltip } from "react-bootstrap";
import { questionScore, timeDelta } from "../scoring";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";

function SessionResults(props) {
  const { sessionId } = useParams();
  const questions = props.game.questions;

  const [results, setResults] = useState(null);
  const [questionStats, setQuestionStats] = useState([]);

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

  // calculate score and time taken for each player/question
  const calculateScores = (results) => {
    results.forEach((player) => {
      player.answers.forEach((ans, i) => {
        const timeTaken = timeDelta(ans.questionStartedAt, ans.answeredAt);
        ans.duration = timeTaken;
        ans.score = questionScore(
          ans.correct,
          questions[i].points,
          questions[i].duration,
          timeTaken
        );
      });
      // calculate total score for each player
      player.score = player.answers.reduce((acc, ans) => acc + ans.score, 0);
    });
    setResults(results);
    // now calculate question stats
    // for now just % of players who answered correctly
    // and average response time
    const stats = questions.map((question, i) => {
      const questionResults = results.map((player) => player.answers[i]);
      const correctCount = questionResults.filter(
        (ans) => ans.correct === true
      ).length;
      const avgTime = questionResults.reduce((acc, ans) => {
        return acc + (ans.duration || 0);
      }, 0);
      return {
        questionTitle: "Q" + (i + 1),
        avgCorrect: correctCount * 100 / results.length,
        avgTime: avgTime / results.length,
      };
    });
    setQuestionStats(stats);
  };

  return (
    <>
      <h2 className="text-white">Results</h2>
      <Table
        striped
        bordered
        hover
        style={{ maxWidth: "360px", borderRadius: "6px", overflow: "hidden" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {results &&
            results
              .sort((a, b) => b.score - a.score)
              .slice(0, 5)
              // only show top 5 players
              .map((result, index) => {
                let medal = "";
                if (index === 0) medal = "🥇";
                else if (index === 1) medal = "🥈";
                else if (index === 2) medal = "🥉";
                return (
                  <tr key={index}>
                    <td>
                      {result.name} {medal}
                    </td>
                    <td>{result.score.toFixed(1)}</td>
                  </tr>
                );
              })}
        </tbody>
      </Table>
      <div>
        <LineChart
          width={400}
          height={300}
          data={questionStats}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="questionTitle" />
          <YAxis yAxisId="left" domain={[0, 100]} />
          <YAxis yAxisId="right" orientation="right" />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="avgCorrect"
            stroke="#8884d8"
            name="Correct %"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgTime"
            stroke="#82ca9d"
            name="Avg Time (s)"
          />
        </LineChart>
      </div>
    </>
  );
}

export default SessionResults;
