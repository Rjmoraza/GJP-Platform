const express = require('express');
const user_route = express();

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true })); 

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const userController = require('../controllers/userController');

user_route.post('/register-user', upload.none(), userController.registerUser);
user_route.post('/login-user', upload.none(), userController.loginUser);
user_route.post('/register-users-from-csv/:siteId/:jamId', upload.none(), userController.registerUsersFromCSV);
user_route.get('/magic-link/:token', userController.magicLink);
user_route.get('/log-out-user', userController.logOutUser);
user_route.get('/get-users', userController.getUsers);
user_route.get('/get-user', userController.getCurrentUser);
user_route.get('/get-jammers-per-site/:siteId/:jamId', userController.getJammersPerSite);
user_route.get('/get-free-jammers-per-site/:siteId', userController.getJammersNotInTeamPerSite);
user_route.get('/get-site-staff/:siteId', userController.getStaffPerSite);
user_route.put('/update-user/:id', upload.none(), userController.updateUser);
user_route.put('/update-user-site/:id', userController.updateSite);
user_route.delete('/delete-user/:id', userController.deleteUser);
user_route.get('/get-localPerSite/:siteId', userController.getLocalOrganizersPerSite);
user_route.get('/addRol/:id', userController.addRol);
user_route.get('/deleteRol/:id', userController.deleteRol);
user_route.post('/save-jammer-data', upload.none(), userController.saveJammerData);

if(process.env.TARGET == "DEV")
{
    user_route.post('/get-link', upload.none(), userController.getLoginLink);
}

module.exports = user_route;