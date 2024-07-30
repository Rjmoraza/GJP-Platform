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

        console.log(req.body);

        const jam = new Jam({
            title: req.body.title,
            open: true,
            public: false,
            sites: [],
            jammers: [],
            toolbox: req.body.toolbox,
            themes: req.body.themes,
            categories: req.body.categories,
            stages: req.body.stages,
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
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateJam = async(req, res) => {
    try{
        // Validate the user
        const creatorUser = await userController.validateUser(req);
        if(!creatorUser)
        {
            return res.status(403).json({success: false, message: 'Session is invalid'});
        }

        console.log("User is valid");

        const jamId = req.params.id;
        const jam = await Jam.findOne({ _id: jamId });
        if(jam === undefined || jam == null)
        {
            return res.status(400).json({ success: false, message: 'No jam found with that id' });
        }

        console.log(`Jam found with Id: ${jam._id}`);
        console.log(req.body);

        jam.title = req.body.title;
        jam.open = req.body.open;
        jam.public = req.body.public;
        jam.toolbox = req.body.toolbox;
        jam.themes = req.body.themes;
        jam.categories = req.body.categories;
        jam.stages = req.body.stages;
        jam.lastUpdateUser = {
            userId: creatorUser._id,
            name: creatorUser.name,
            email: creatorUser.email
        };
        jam.lastUpdateDate = new Date();

        console.log(jam);
        
        await jam.save();

        return res.status(200).json({ success: true, message: 'GameJam updated successfully.', jamId: jam._id });
    } catch(error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const deleteJam = async(req, res) => {};

const getCurrentJam = async(req, res) => {
    const jam = await findCurrentJam();
    if(jam !== undefined && jam)
    {
        res.status(200).send({ success: true, data: jam });    
    }
    else
    {
        res.status(400).send({ success: false, message: 'No active game jam found' });
    }
};

const listJams = async(req, res) => {
    const jams = await Jam.find({});
    if(jams !== undefined && jams)
    {
        res.status(200).send({ success: true, data: jams });
    }
    else
    {
        res.status(400).send({ success: false, message: 'Error loading jams '});
    }
};

const getCurrentStage = async(req, res) => {};
// #endregion

// #region PRIVATE FUNCTIONS
const findCurrentJam = async() => {
    return await Jam.findOne({ open:true });
};

// #endregion

module.exports = {
    createJam,
    updateJam,
    deleteJam,
    getCurrentJam,
    listJams,
    getCurrentStage
};