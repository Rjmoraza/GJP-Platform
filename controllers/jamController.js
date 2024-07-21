const Jam = require('../models/jamModel');
const User = require('../models/userModel');
const Team = require('../models/teamModel');
const jwt = require('jsonwebtoken');
const userController = require('./userController');
const mongoose = require('mongoose');

// #region PUBLIC FUNCIONS
const createJam = async(req, res) => {
    try{
        // Validate the user
        const creatorUser = await userController.validateUser(req);
        if(!creatorUser)
        {
            return res.status(403).json({success: false, error: 'Session is invalid'});
        }

        const jam = new Jam({
            title: req.body.title,
            open: true,
            public: false,
            sites: [],
            jammers: [],
            toolbox: req.body.toolbox | null,
            themes: req.body.themes,
            categories: req.body.categories,
            deadlineStage1: req.body.deadlineStage1 | null,
            deadlineStage2: req.body.deadlineStage2 | null,
            deadlineStage3: req.body.deadlineStage3 | null,
            deadlineEvaluation1: req.body.deadlineEvaluation1 | null,
            deadlineEvaluation2: req.body.deadlineEvaluation2 | null,
            deadlineEvaluation3: req.body.deadlineEvaluation3 | null,
            creatorUser: {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            creationDate: new Date(),
            lastUpdateUser: {
                userID: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            lastUpdateDate: new Date()
        });

        await jam.save();
        res.status(200).json({ success: true, msg: 'GameJam created successfully.', jamId: jam._id });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateJam = async(req, res) => {};

const deleteJam = async(req, res) => {};

const getCurrentJam = async(req, res) => {
    const jam = await Jam.findOne({ open:true });
    if(jam !== undefined && jam)
    {
        res.status(200).send({ success: true, data: jam });    
    }
    else
    {
        res.status(400).send({ success: false, message: 'No active game jam found' });
    }
};

const getJams = async(req, res) => {};

const getCurrentStage = async(req, res) => {};
// #endregion

// #region PRIVATE FUNCTIONS
const findCurrentJam = () => {};


// #endregion

module.exports = {
    createJam,
    updateJam,
    deleteJam,
    getCurrentJam,
    getJams,
    getCurrentStage
};