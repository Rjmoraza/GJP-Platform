const mongoose = require('mongoose');
const { Schema } = mongoose;

const userOnJamSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    siteId: {
        type: Schema.Types.ObjectId, ref: 'Site'
    },
    jamId: {
        type: Schema.Types.ObjectId, ref: 'Jam'
    }
});

module.exports = mongoose.model("UserOnJam", userOnJamSchema);