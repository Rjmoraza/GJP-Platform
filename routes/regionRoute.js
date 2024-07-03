const express = require('express');
const region_route = express();

const bodyParser = require('body-parser');
region_route.use(bodyParser.json());
region_route.use(bodyParser.urlencoded({ extended: true })); 
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const regionController = require('../controllers/regionController');

region_route.post('/create-region', upload.none(), regionController.createRegion);
region_route.put('/update-region/:id', upload.none(), regionController.updateRegion);
region_route.get('/get-region/:id', regionController.getRegion);
region_route.get('/get-regions', regionController.getRegions);
region_route.delete('/delete-region/:id', regionController.deleteRegion);

module.exports = region_route;