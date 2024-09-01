const mongoose = require('mongoose');
const { Schema } = mongoose;

const siteSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    open: {
        type: Boolean,
        required: true
    },
    modality: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    regionId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Region',
        required: true
    },
    country:  {
        name: { 
            type: String 
        },
        code: { 
            type: String 
        }
    },
    city: {
        type: String
    },
    language: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    address: {
        type: String
    },
    server: {
        type: String
    },
    instagram: {
        type: String
    },
    whatsapp: {
        type: String
    },
    discord: {
        type: String
    },
    website: {
        type: String
    },
    email: {
        type: String
    },
    startTime: {
        type: String
    },
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

module.exports = mongoose.model("Site", siteSchema);
