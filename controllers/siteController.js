const Site = require('../models/siteModel');
const Region = require('../models/regionModel');
const Team = require('../models/teamModel');
const User = require('../models/userModel');
const Jam = require('../models/jamModel');
const SiteOnJam = require('../models/siteOnJamModel');
const UserOnJam = require('../models/userOnJamModel');
const userController = require('./userController');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const crypto = require('node:crypto');

const createSite = async (req, res) => {
    // TODO change this method to receive full country struct
    const { name, regionId, country, city, modality } = req.body;
    try {
        const creatorUser = await userController.validateUser(req);
        if(!creatorUser)
        {
            return res.status(403).json({success: false, error: 'Session is invalid'});
        }
        else if (!mongoose.Types.ObjectId.isValid(regionId)) {
            return res.status(400).json({ success: false, message: 'The provided region ID is not valid.' });
        } else {
            const existingRegion = await Region.findById(regionId);
            if (!existingRegion) {
                return res.status(404).json({ success: false, message: "That region doesn't exist" });
            }
        }

        let countryData = findCountry(country);

        if (!countryData) {
            return res.status(400).json({ success: false, message: "The provided country is not valid" });
        }

        // Generate a unique code for this team (make sure it's a unique code)
        let existingSite;
        let uniqueCode;
        do
        {
            uniqueCode = crypto.randomBytes(10).toString('hex').slice(0,6).toUpperCase();
            existingSite = await Site.findOne({ code: uniqueCode });
        }
        while(existingSite);

        const site = new Site({
            name: name,
            code: uniqueCode,
            modality: modality,
            country: {
                name: countryData.name,
                code: countryData.code 
            },
            regionId: regionId,
            city: city,
            open: false,
            description: "",
            creatorUser: {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            creationDate: new Date()
        });

        newSite = await site.save();
        res.status(200).json({ success: true, message: 'The site has been created successfully', site: newSite});
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


const updateSite = async (req, res) => {
    // TODO change this method to receive full country struct
    const { name, regionId, country, city, open, address, server, modality, description, language, phoneNumber, email, startTime } = req.body;
    const id = req.params.id;
    try {
        const creatorUser = await userController.validateUser(req);
        if(!creatorUser)
        {
            return res.status(403).json({success: false, message: 'Session is invalid'});
        }
        else if (!mongoose.Types.ObjectId.isValid(regionId)) {
            return res.status(400).json({ success: false, message: 'The provided region ID is not valid.' });
        } else {
            const existingRegion = await Region.findById(regionId);
            if (!existingRegion) {
                return res.status(404).json({ success: false, message: "That region doesn't exist" });
            }
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Site not found (Site ID invalid)' });
        } 
        let site = await Site.findById(id);
        if (!site) {
            return res.status(404).json({ success: false, message: 'Site not found' });
        }
        let countryData = findCountry(country);
        if (!countryData) {
            return res.status(400).json({ success: false, message: "The country is not valid" });
        }
        
        site.name = name;
        site.regionId = regionId;
        site.country = {
            name: countryData.name,
            code: countryData.code
        };
        site.city = city;
        site.address = address;
        site.server = server;
        site.modality = modality;
        if(description) site.description = description;
        if(open) site.open = open;
        if(language) site.language = language;
        if(phoneNumber) site.phoneNumber = phoneNumber;
        if(email) site.email = email;
        if(startTime) site.startTime = startTime;
        site.lastUpdateUser = creatorUser;
        site.lastUpdateDate = new Date();

        let newSite = await site.save();

        res.status(200).send({ success: true, message: 'Site updated successfully', site: newSite});
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};


const getSite = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Site ID is not valid' });
        } else {
            const site = await Site.findById(id);
            if (!site) {
                return res.status(404).json({ success: false, message: "Site not found" });
            }
            else {
                return res.status(200).send({ success:true, message:'Site found', data: site });
            }
        }
    } catch(error) {
        return res.status(400).send({ success:false, message:error.message });
    }
};

const getSiteByCode = async(req, res)=>{
    try{
        const code = req.params.code;
        const site = await Site.findOne({ code: code });
        if (!site) {
            return res.status(404).json({ success: false, message: "Site not found" });
        }
        res.status(200).send({ success:true, message:'Site found', data: site });
    } catch(error) {
        res.status(400).send({ success:false, message:error.message });
    }
}

const changeStatus = async (req, res) => {
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);

        const site = await Site.findById(creatorUser.site._id);
        if(site.open === 1) {
            site.open = 0;
        } else {
            site.open = 1;
        }
        
        await site.save(); 
        res.status(200).json({ success: true, message: 'Site status updated successfully'});
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateDescription = async (req, res) => {
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);

        const site = await Site.findById(creatorUser.site._id);

        const description = req.params.description;

        site.description = description;
        await site.save();
        res.status(200).json({ success: true, message: 'Description updated successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getSites = async(req,res)=>{
    try{
        //console.log(`Sites query received at ${new Date()}...`);
        const allSites = await Site.find({});
        //console.log(`Sites query resolved at ${new Date()}...`);
        return res.status(200).send({ success:true, message: 'Sites listed successfully', data: allSites });
    } catch(error) {
        return res.status(400).send({ success:false, message: error.message });
    }
};

const getCountries = async (req, res) => {
    try {
        const countriesPath = path.join(__dirname, '..', 'staticData', 'countries.json');
        
        fs.readFile(countriesPath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ success: false, message: 'Error reading countries JSON' });
                return;
            }

            const countries = JSON.parse(data);
            res.status(200).json({ success: true, message: 'Countries listed successfully', data: countries });
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getSitesPerRegion = async (req, res) => {
    try {
        const regionId = req.params.regionId;
        if (!mongoose.Types.ObjectId.isValid(regionId)) {
            return res.status(400).json({ success: false, error: 'Region ID is invalid' });
        } else {
            const sites = await Site.find({ 'regionId': regionId });
            return res.status(200).json({ success: true, message: 'Sites found successfully', data: sites });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const getSitesPerRegionOpen = async (req, res) => {
    try {
        const region = req.params.regionId;
        if (!mongoose.Types.ObjectId.isValid(region)) {
            return res.status(400).json({ success: false, message: 'Region ID is invalid' });
        } else {
            const existingRegion = await Region.findById(region);
            if (!existingRegion) {
                return res.status(404).json({ success: false, message: "Region not found" });
            } else {
                const selectedSites = await Site.find({ 'region._id': region, 'open': 0  });
                return res.status(200).json({ success: true, message: 'Sites listed successfully', data: selectedSites });
            }
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const getSitesByJam = async (req, res) => {
    try{
        let jamId = req.params.id;

        if(jamId == "open")
        {
            console.log("Finding open jam...");
            const jam = await Jam.findOne({ open: true });
            if(!jam)
            {
                return res.status(404).json({ success: false, message: "There are no open jams"});
            }
            jamId = jam._id;
        }

        const sitesOfJam = await SiteOnJam.find({ jamId : jamId});
        let siteIds = Array();
        sitesOfJam.forEach(soj => {
            siteIds.push(soj.siteId);
        });

        const sites = await Site.find({
            _id : {"$in" : siteIds }
        });

        if(sites.length > 0)
        {            
            return res.status(200).json({success: true, data: sites});
        }
        else
        {
            return res.status(400).json({success: false, message: "No sites found"});
        }
    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
};

const deleteSite = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Site ID is invalid' });
        } else {
            const existingRegion = await Site.findById(id);
            if (!existingRegion) {
                return res.status(404).json({ success: false, message: "Site not found" });
            }
        }
        const deletedSite = await Site.findOneAndDelete({ _id: id });
        
        await User.updateMany({ 'site._id' : id } , { site : null });
        return res.status(200).send({ success: true, message:'Site deleted successfully' });
    } catch(error) {
        return res.status(400).send({ success:false, message:error.message });
    }
};

const joinJammerToSite = async(req, res)=>{
    try{
        let { siteId, userId, jamId } = req.body;

        if(!jamId)
        {
            const jam = await Jam.findOne({ open: true });
            if(!jam) return res.status(400).json({success: false, message: "No open jams available"});
            jamId = jam._id;
        }

        const uoj = await UserOnJam.find({
            userId: userId,
            siteId: siteId,
            jamId: jamId
        });

        if(uoj.length > 0) return res.status(400).json({success: false, message: "User already registered to this site"});

        const userOnJam = new UserOnJam({
            userId: userId,
            siteId: siteId,
            jamId: jamId
        });
        await userOnJam.save();

        const site = await Site.findById(siteId);
        const jam = await Jam.findById(jamId);
        return res.status(200).json({success: true, data: {jam: jam, site: site}});
    } catch (error) {
        return res.status(400).send({success: false, message: error.message});
    }
};

const findCountry = (countryName) =>
{
    const countriesPath = path.join(__dirname, '..', 'staticData', 'countries.json');
    const countriesData = JSON.parse(fs.readFileSync(countriesPath, 'utf8'));
    return countriesData.find(country => country.name === countryName);
}

module.exports = {
    createSite,
    updateSite,
    getSite,
    getSiteByCode,
    getSites,
    getCountries,
    getSitesPerRegion,
    getSitesPerRegionOpen,
    getSitesByJam,
    joinJammerToSite,
    deleteSite,
    changeStatus,
    updateDescription
};