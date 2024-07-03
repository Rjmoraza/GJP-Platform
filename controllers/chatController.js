const mongoose = require('mongoose');
const Chat = require('../models/chatModel')
const Team = require('../models/teamModel')
const User = require('../models/userModel')

const createChat = async (req, res) => {
    const { participants } = req.body;
    
    if (!participants) {
      return res.status(400).json({ success: false, error: 'Participants are required.' });
    }
  
    try {
      const chat = new Chat({
        participants: participants.map(participant => ({
          participantType: participant.participantType,
          participantId: participant.participantId
        }))
      });
  
      await chat.save();
  
      res.status(200).json({ success: true, msg: 'Chat created', data: chat });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
  

const getChat = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: 'El ID proporcionado no es válido.' });
    }

    const existingChat = await Chat.findById(id);
    if (existingChat) {
        return res.status(200).json({ success: true, msg: 'chat', data: existingChat });
    }
    return res.status(400).json({ success: false, msg: 'No existe el chat' });
};

const sendMessage = async (req, res) => {
  const { sender, msg } = req.body;
  const id = req.params.id;

  try {
      const chat = await Chat.findById(id);
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, error: 'El ID proporcionado no es válido.' });
      }
      if(!chat){
          return res.status(400).json({ success: false, msg: 'No existe el chat' });
      }
      chat.messagesList.push({
          senderId: sender.Id,
          senderType:sender.Type,
          message: msg,
          sentDate: new Date()
      })

      await chat.save();
      return res.status(200).json({ success: true, msg: 'chat', data: chat.messagesList });
      
  } catch (error) {
      return res.status(400).json({ success: false, msg: 'error al enviar' });
  }
};



const getChatbyParticipants = async (req, res) => {
  const participantIds = req.query.participantIds;

  if (!participantIds || !Array.isArray(participantIds)) {
      return res.status(400).json({ success: false, msg: 'Se requieren IDs de participantes válidos.' });
  }

  try {
      const chat = await Chat.find({
          'participants.participantId': { $all: participantIds }
      });

      if (chat.length > 0) {
          return res.status(200).json({ success: true, msg: 'Chat encontrado', data: chat[0] });
      } else {
          return res.status(404).json({ success: false, msg: 'Chat no encontrado' });
      }
  } catch (error) {
      return res.status(500).json({ success: false, msg: 'Error del servidor', error });
  }
};

const getJammerChat = async (req, res) => {
    const teamName = req.query.teamName;
  
    try {
      // Paso 1: Buscar el equipo por su nombre
      const team = await Team.findOne({ studioName: teamName });
  
      if (!team) {
        return res.status(404).json({ success: false, msg: 'Equipo no encontrado' });
      }
  
      // Paso 2: Obtener el ID del equipo encontrado
      const teamId = team._id;
  
      // Paso 3: Buscar el chat asociado al ID del equipo
      const chat = await Chat.findOne({ 'participants.participantId': teamId });
  
      if (!chat) {
        return res.status(404).json({ success: false, msg: 'Chat no encontrado para este equipo' });
      }
  
      return res.status(200).json({ success: true, msg: 'Chat encontrado', data: chat });
    } catch (error) {
      return res.status(500).json({ success: false, msg: 'Error del servidor', error });
    }
  };

  const jammerSendMessage = async (req, res) => {
    const { sender, msg } = req.body;
    const id = req.params.id;
    console.log(sender)
    try {
      const team = await Team.findOne({ studioName: sender });
  
      if (!team) {
        return res.status(404).json({ success: false, msg: 'Equipo no encontrado' });
      }
  
      // Paso 2: Obtener el ID del equipo encontrado
      const teamId = team._id;
        const chat = await Chat.findById(id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID proporcionado no es válido.' });
        }
        if(!chat){
            return res.status(400).json({ success: false, msg: 'No existe el chat' });
        }
        chat.messagesList.push({
            senderId: teamId.Id,
            senderType: "Team",
            message: msg,
            sentDate: new Date()
        })  

        await chat.save();
        return res.status(200).json({ success: true, msg: 'chat', data: chat.messagesList });
        
    } catch (error) {
        return res.status(400).json({ success: false, msg: 'error al enviar' });
    }
};



module.exports = {
    createChat,
    getChat,
    sendMessage,
    getChatbyParticipants,
    getJammerChat,
    jammerSendMessage
};

/*const chat = new Chat({
            participants: participants.map(participant => ({
                participantType: participant.participantType,
                participantId: participant.participantId
            }))
        })*/