const express = require('express');
const game_jam_route = express();

const bodyParser = require('body-parser');
game_jam_route.use(bodyParser.json());
game_jam_route.use(bodyParser.urlencoded({ extended: true })); 
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const jamController = require('../controllers/jamController');

game_jam_route.post('/create-jam', upload.none(), jamController.createJam);
game_jam_route.put('/update-jam/:id', upload.none(), jamController.updateJam);
game_jam_route.delete('/delete-jam/:id', jamController.deleteJam);
game_jam_route.get('/get-current-jam', jamController.getCurrentJam);
game_jam_route.get('/get-jams', jamController.getJams);
game_jam_route.get('/get-current-stage', jamController.getCurrentStage);

module.exports = game_jam_route;