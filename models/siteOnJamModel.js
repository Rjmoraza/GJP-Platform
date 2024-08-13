const mongoose = require('mongoose');
const { Schema } = mongoose;

const siteOnJamSchema = new Schema({
    siteId: {
        type: Schema.Types.ObjectId, ref: 'Site'
    },
    jamId: {
        type: Schema.Types.ObjectId, ref: 'Jam'
    },
});

module.exports = mongoose.model("SiteOnJam", siteOnJamSchema);