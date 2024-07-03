const express = require('express');
const prize_route = express();

const bodyParser = require('body-parser');
prize_route.use(bodyParser.json());
prize_route.use(bodyParser.urlencoded({ extended: true })); 
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const prizeController = require('../controllers/prizeController');

prize_route.post('/create-prize', upload.none(), prizeController.createPrize);
prize_route.put('/update-prize/:id', upload.none(), prizeController.updatePrize);
prize_route.get('/get-prize/:id', prizeController.getPrize);
prize_route.get('/get-prizes', prizeController.getPrizes);
prize_route.delete('/delete-prize/:id', prizeController.deletePrize);

module.exports = prize_route;