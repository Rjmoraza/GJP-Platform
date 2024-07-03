const express = require('express');
const game_jam_route = express();

const bodyParser = require('body-parser');
game_jam_route.use(bodyParser.json());
game_jam_route.use(bodyParser.urlencoded({ extended: true })); 
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const gameJamController = require('../controllers/gameJamController');


game_jam_route.post('/create-game-jam', upload.none(), gameJamController.createGameJam);
game_jam_route.put('/update-game-jam/:id', upload.none(), gameJamController.updateGameJam);
game_jam_route.get('/get-current-game-jam', gameJamController.getCurrentGameJam);
game_jam_route.get('/get-eval-game-jam', gameJamController.getGameJamToEvaluate);
game_jam_route.get('/get-game-jam/:id', gameJamController.getGameJam);
game_jam_route.get('/get-game-jams', gameJamController.getGameJams);
game_jam_route.get('/get-time-left', gameJamController.getTimeRemaining);
game_jam_route.get('/get-time-left-evaluator', gameJamController.getTimeRemainingEvaluation);
game_jam_route.delete('/delete-game-jam/:id', gameJamController.deleteGameJam);

module.exports = game_jam_route;