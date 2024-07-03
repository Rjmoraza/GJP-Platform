const express = require('express');
const chat_route = express();

const bodyParser = require('body-parser');
chat_route.use(bodyParser.json());
chat_route.use(bodyParser.urlencoded({ extended: true })); 

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const chatController = require('../controllers/chatController');

chat_route.post('/create-chat', upload.none(), chatController.createChat);
chat_route.get('/get-chat/:id', chatController.getChat);
chat_route.get('/get-chat-by-participants', chatController.getChatbyParticipants);
chat_route.post('/send-chat/:id', upload.none(), chatController.sendMessage);
chat_route.get('/get-jammer-chat', chatController.getJammerChat);
chat_route.post('/jammer-sent/:id', upload.none(), chatController.jammerSendMessage);

module.exports = chat_route;