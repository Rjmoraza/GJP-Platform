const mongoose = require('mongoose');
const { Schema } = mongoose;

const jamSchema = mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    open: {
        type:Boolean,
        required:true
    },
    public: {
        type:Boolean,
        required:true
    },
    sites: [{
        _id: {
            type: Schema.Types.ObjectId, ref: 'Site'
        },
        name: {
            type: String
        },
        region: {
            type: Schema.Types.ObjectId, ref: 'Region'
        }
    }],
    jammers: [{
        _id: {
            type: Schema.Types.ObjectId, ref: 'User'
        },
        team: {
            type: Schema.Types.ObjectId, ref: 'Team'
        },
        site: {
            type: Schema.Types.ObjectId, ref: 'Site'
        },
        name: {
            type: String
        },
        email: {
            type: String
        }
    }],
    toolbox: {
        type: String
    },
    themes: [{
        titlePT: {
            type: String
        },
        titleES: {
            type: String
        },
        titleEN: {
            type: String
        },
        descriptionPT: {
            type: String
        },
        descriptionES: {
            type: String
        },
        descriptionEN: {
            type: String
        },
        manualPT: {
            type: String
        },
        manualES: {
            type: String
        },
        manualEN: {
            type: String
        },
    }],
    categories: [{
        titlePT: {
            type: String
        },
        titleES: {
            type: String
        },
        titleEN: {
            type: String
        },
        descriptionPT: {
            type: String
        },
        descriptionES: {
            type: String
        },
        descriptionEN: {
            type: String
        },
        manualPT: {
            type: String
        },
        manualES: {
            type: String
        },
        manualEN: {
            type: String
        },
    }],
    deadlineStage1: {
        type: Date
    },
    deadlineStage2: {
        type: Date
    },
    deadlineStage3: {
        type: Date
    },
    deadlineEvaluation1: {
        type: Date
    },
    deadlineEvaluation2: {
        type: Date
    },
    deadlineEvaluation3: 
    {
        type: Date
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

module.exports = mongoose.model("Jam", jamSchema);