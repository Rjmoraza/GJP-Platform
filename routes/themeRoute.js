const express = require('express');
const theme_route = express();
const bodyParser = require('body-parser');
theme_route.use(bodyParser.json());
theme_route.use(bodyParser.urlencoded({ extended: true })); 



const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const load = upload.fields([
    { name: 'manualSP', maxCount: 1 },
    { name: 'manualEN', maxCount: 1 },
    { name: 'manualPT', maxCount: 1 }
]);
const themeController = require('../controllers/themeController');

theme_route.get('/get-theme/:id', themeController.getTheme);
theme_route.get('/get-themes', themeController.getThemes);
theme_route.get('/get-games-per-theme/:id', themeController.getGamesPerTheme);
theme_route.post('/create-theme', load, themeController.createTheme)
theme_route.put('/update-theme/:id',load, themeController.updateTheme)
theme_route.delete('/delete-theme/:id', themeController.deleteTheme);
theme_route.get('/pdf/:id/:language', themeController.getPDF);

module.exports = theme_route;  