# Bonus Features
## Dashboard
- A separate scrollable list shows all current active games, making it easy to see which games are active.
- When creating a new game, the input fields are clientside verified and give immediate feedback via popups to guide the user.
- The modal for managing games has buttons greyed out when inapplicable
  - e.g. Start Game is disabled when a game is already active.
  - Show Results is disabled when there are no previous games.
  - This gives immediate feedback to the user and pre-emptively stops them from choosing invalid options.
- A confirmation dialog shows up when starting and deleting a game.
- Past results can be browsed with a dropdown menu, leading to the results screen of that session.
## Admin Session Management
- A list of players is shown to give feedback to the admin.
- While a game is in session, the time remaining is shown on screen to give feedback to the admin.
- The "next question" button changes to "skip question" while there is still time left.
- In the results screen, a biaxial graph neatly shows the Correct % and Avg Time data for each question.