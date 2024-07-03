const mongoose = require('mongoose');
const { Schema } = mongoose;

const prizeSchema = mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    price: {
        type: Number,
        required: true
    },
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

module.exports = mongoose.model("Prize", prizeSchema);