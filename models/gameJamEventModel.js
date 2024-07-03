const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameJamSchema = mongoose.Schema({
    edition: {
        type:String,
        required:true
    },
    stages: [{   
        _id: { type: Schema.Types.ObjectId, ref: 'Stage'},
        name: { 
            type: String
        },
        startDate: { 
            type: Date
        },
        endDate: { 
            type: Date
        },
        startDateEvaluation: { 
            type: Date
        },
        endDateEvaluation: { 
            type: Date
        },
    }],
    themes:  [{
        _id: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Theme',
            required: true
        },
        titleEN: { 
            type: String, 
            required: true 
        }
    }],
    creatorUser:  {
        userId: {
            type: Schema.Types.ObjectId, 
            ref: 'GlobalOrganizer',
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
            ref: 'GlobalOrganizer'
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

module.exports = mongoose.model("GameJam", gameJamSchema);