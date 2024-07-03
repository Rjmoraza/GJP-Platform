const mongoose = require('mongoose');
const { Schema } = mongoose;


const chatSchema = new Schema({
    participants: [{
        participantType: {
            type: String,
            enum: ['User', 'Team'],
            required: true
        },
        participantId: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'participants.participantType'
        }

    }],
    messagesList: [{
        senderId: {
            type: Schema.Types.ObjectId,
            refPath: 'messages.senderType'
        },
        senderType: {
            type: String,
            enum: ['User', 'Team'],
        },
        message: {
            type: String,
        },
        sentDate: {
            type: Date
        }

    }]

});

module.exports = mongoose.model("Chat", chatSchema);
