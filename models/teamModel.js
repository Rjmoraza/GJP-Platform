const mongoose = require('mongoose');
const { Schema } = mongoose;

const teamSchema = mongoose.Schema({
    teamName: {
        type:String,
        required:true
    },
    teamCode:{
        type:String,
        required:true
    },
    siteId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site',
        required: true
    },
    jamId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Jam',
            required: true
    },
    // Keep jammers info in case the jammer exits the platform
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
        },
        role: {
            type: String
        }
    }],
    submissions:   [{
        type: Schema.Types.ObjectId, 
        ref: 'Submission',
        required: false
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