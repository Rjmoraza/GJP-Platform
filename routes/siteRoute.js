const express = require('express');
const site_route = express();

const bodyParser = require('body-parser');
site_route.use(bodyParser.json());
site_route.use(bodyParser.urlencoded({ extended: true })); 
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const siteController = require('../controllers/siteController');

site_route.post('/create-site', upload.none(), siteController.createSite);
site_route.put('/update-site/:id', upload.none(), siteController.updateSite);
site_route.get('/get-site/:id', siteController.getSite);
site_route.get('/get-sites', siteController.getSites);
site_route.get('/get-countries', siteController.getCountries);
site_route.get('/change-status', siteController.changeStatus);
site_route.get('/get-sites-per-region/:regionId', siteController.getSitesPerRegion);
site_route.get('/get-sites-per-region-open/:regionId', siteController.getSitesPerRegionOpen);
site_route.delete('/delete-site/:id', siteController.deleteSite);

module.exports = site_route;