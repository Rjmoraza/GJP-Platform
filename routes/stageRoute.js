const express = require('express');
const stage_route = express();

const bodyParser = require('body-parser');
stage_route.use(bodyParser.json());
stage_route.use(bodyParser.urlencoded({ extended: true })); 
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const stageController = require('../controllers/stageController');

stage_route.post('/create-stage', upload.none(), stageController.createStage);
stage_route.put('/update-stage/:id', upload.none(), stageController.updateStage);
stage_route.get('/get-current-stage', stageController.getCurrentStage);
stage_route.get('/get-stage/:id', stageController.getStage);
stage_route.get('/get-stages', stageController.getStages);
stage_route.delete('/delete-stage/:id', stageController.deleteStage);

module.exports = stage_route;