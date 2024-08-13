const Jam = require('../models/jamModel');
const Site = require('../models/siteModel');
const User = require('../models/userModel');
const Team = require('../models/teamModel');
const SiteOnJam = require('../models/siteOnJamModel');
const UserOnJam = require('../models/userOnJamModel');
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
                userId: creatorUser._id,
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
        
        await jam.save();

        return res.status(200).json({ success: true, message: 'GameJam updated successfully.', jamId: jam._id });
    } catch(error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

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

const listOpenJams = async(req, res) => {
    const jams = await Jam.find({ open: true });
    if(jams !== undefined && jams)
    {
        res.status(200).send({ success: true, data: jams });
    }
    else
    {
        res.status(400).send({ success: false, message: 'Error loading jams '});
    }
}


// Joins one site to one open jam
const joinSiteToJam = async(req, res) => {
    console.log(req.body);
    const { siteId, jamId } = req.body;
    try{
        const site = await Site.findOne({ _id: siteId });
        const jam = await Jam.findOne({ _id: jamId, open: true });

        if(!site) return res.status(404).json({ success: false, message: "Site is not valid" });
        if(!jam) return res.status(404).json({ success: false, message: "Jam is not valid" });

        const siteOnJam = new SiteOnJam({
            siteId: siteId,
            jamId: jamId
        });

        await siteOnJam.save();
        return res.status(200).json({success: true, data: jam});
        
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// returns an open gamejam that is linked to a siteID or error if not jam found
const getJamBySite = async(req, res) => {
    const id = req.params.id;

    const jamsOfSite = await SiteOnJam.find({ siteId : id });
    if(jamsOfSite.length <= 0) 
    {
        return res.status(404).send({success: false, message: 'No jam found'});
    }
    
    let jamIds = new Array();
    jamsOfSite.forEach(jam => {
        jamIds.push(jam.jamId);
    });

    const jam = await Jam.findOne({
        _id: { "$in": jamIds },
        open: true
    });

    if(jam)
    {
        return res.status(200).send({success: true, data: jam});
    }
    else{
        return res.status(404).send({success: false, message: 'No jam found'});
    }
};

// returns an open gamejam that is linked to a userID or error if not jam found
const getJamByUser = async(req, res) => {

};

const getCurrentStage = async(req, res) => {};
// #endregion

module.exports = {
    createJam,
    updateJam,
    deleteJam,
    getCurrentJam,
    getJamBySite,
    getJamByUser,
    getCurrentStage,
    joinSiteToJam,
    listJams,
    listOpenJams
};