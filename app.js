const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
app.use(express.json());

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("This server is running in http://localhost:3001");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//All Players
app.get("/players/", async (request, response) => {
  let playersQuery = `SELECT * FROM cricket_team ORDER BY player_id;`;
  const allPlayers = await db.all(playersQuery);
  response.send(
    allPlayers.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});
//Create New Players
app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerQuery = `SELECT * FROM cricket_team
    WHERE player_id=${playerId};`;
  const player = await db.run(playerQuery);
  response.send(convertDbObjectToResponseObject(player));
});

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postPlayerQuery = `INSERT INTO cricket_team(playerName, jerseyNumber, role)
    VALUES(${playersName}, ${jerseyNumber}, ${role});`;
  const player = await db.run(postPlayerQuery);
  response.send("Player Added to Team");
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { playerId } = request.params;
  const updatePlayersQuery = `UPDATE cricket_team
    SET player_name=${playerName},
    jersey_number=${jerseyNumber},
    role=${role}
    WHERE player_id=${playerId};`;
  const player = await db.run(updatePlayersQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `DELETE FROM cricket_team
    WHERE player_id=${playerId};`;
  const player = await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
