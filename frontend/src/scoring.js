// scoring.js
// This file contains the scoring logic for the game.

// Get the time difference between two timestamps in seconds
export function timeDelta(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return (end - start) / 1000; // time in seconds
}

// Calculate score for one question
// Scoring scales from 100-200% of question value based on % time taken
export function questionScore(isCorrect, points, duration, timeTaken) {
  return isCorrect
    ? points + ((duration - timeTaken) / duration) * points || 0
    : 0;
}
