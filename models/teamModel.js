const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamSchema = mongoose.Schema({
    studioName: {
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    stage:{
        type: Number
    },
    region:  {
        _id: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Region',
            required: true
        },
        name: { 
            type: String, 
            required: true 
        }
    },
    site:  {
        _id: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Site',
            required: true
        },
        name: { 
            type: String, 
            required: true 
        }
    },
    linkTree: [{
        type:String
    }],
    gameJam:  {
        _id: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GameJam',
            required: true
        },
        edition: { 
            type: String, 
            required: true 
        }
    },
    jammers:  [{
        _id: {
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },
        name: { 
            type: String
        },
        email: { 
            type: String
        },
        discordUsername: { 
            type: String
        }
    }],
    lastSub: {
        type: Schema.Types.ObjectId,
        ref: 'Submission'
    },
    submissions:   [{
        type: Schema.Types.ObjectId, 
        ref: 'Submission',
        required: false
    }],
    chatsIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    }],
    creatorUser:  {
        userId: {
            type: Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        },
        name: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true 
        }
    },
    creationDate: {
        type: Date,
        required: true
    },
    lastUpdateUser:  {
        userId: {
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },
        name: { 
            type: String
        },
        email: { 
            type: String
        }
    },
    lastUpdateDate: {
        type: Date
    }
});

module.exports = mongoose.model("Team", teamSchema);