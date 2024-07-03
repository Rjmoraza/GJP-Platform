const mongoose = require('mongoose');
const { Schema } = mongoose;

const themeSchema = mongoose.Schema({
    manualPT: {
        type: Buffer
    },
    manualSP: {
        type: Buffer
    },
    manualEN: {
        type: Buffer
    },
    descriptionSP: {
        type: String
    },
    descriptionPT: {
        type: String
    },
    descriptionEN: {
        type: String
    },
    titleSP: {
        type: String
    },
    titleEN: {
        type: String
    },
    titlePT: {
        type: String
    },
    creatorUser:  {
        userId: {
            type: Schema.Types.ObjectId, 
            ref: 'User',
            required: false
        },
        name: { 
            type: String, 
            required: false 
        },
        email: { 
            type: String, 
            required: false 
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

module.exports = mongoose.model("Theme", themeSchema);
