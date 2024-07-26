const Site = require('../models/siteModel');
const Region = require('../models/regionModel');
const Team = require('../models/teamModel');
const GameJam = require('../models/gameJamEventModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const createSite = async (req, res) => {
    const { name, region, country, modality } = req.body;
    const countryName = country;
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);
        if(!creatorUser.roles.includes("GlobalOrganizer") && !creatorUser.roles.includes("LocalOrganizer")){
            return res.status(400).json({ success: false, message: 'No Permission' });
        }
        if (!mongoose.Types.ObjectId.isValid(region._id)) {
            return res.status(400).json({ success: false, message: 'The provided region ID is not valid.' });
        } else {
            const existingRegion = await Region.findById(region._id);
            if (!existingRegion) {
                return res.status(404).json({ success: false, message: "That region doesn't exist" });
            }
        }

        const countriesPath = path.join(__dirname, '..', 'staticData', 'countries.json');
        const countriesData = JSON.parse(fs.readFileSync(countriesPath, 'utf8'));

        const country = countriesData.find(country => country.name === countryName);

        if (!country) {
            return res.status(400).json({ success: false, message: "The provided country is not valid" });
        }

        const site = new Site({
            name: name,
            modality: modality,
            country: {
                name: countryName,
                code: country.code 
            },
            region: {
                _id: region._id,
                name: region.name
            },
            open: 0,
            description: "",
            creatorUser: {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            creationDate: new Date()
        });

        await site.save();

        res.status(200).json({ success: true, message: 'The site has been created successfully', siteId: site._id  });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


const updateSite = async (req, res) => {
    try {
        const id = req.params.id;
        const updateFields = {};
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const lastUpdateUser = await User.findById(userId);
        const region = req.body.region;
        const countryName = req.body.country;
        const open = req.body.open;
        const modality = req.body.modality;
        const description = req.body.description;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Site not found (Site ID invalid)' });
        } else {
            const existingRegion = await Site.findById(id);
            if (!existingRegion) {
                return res.status(404).json({ success: false, message: 'Site not found' });
            }
        }
        let changed = 0;
        if (req.body.name) {
            updateFields.name = req.body.name;
            changed++;
            const query = { 'site._id': id };

            const updateFieldsQuery = {
                $set: {
                  'site.name': req.body.name,
                  'region._id': req.body.region._id,
                  'region.name': req.body.region.name
                }
            };              

            const updatePromises = [];

            updatePromises.push(
              User.updateMany(query, updateFieldsQuery),
              GameJam.updateMany(query, updateFieldsQuery),
              Team.updateMany(query, updateFieldsQuery)
            );
            
            Promise.all(updatePromises)
            .then(results => {
              results.forEach((result, index) => {
                const modelNames = ['User', 'GameJam', 'Team'];
                console.log(`${modelNames[index]} documents updated successfully:`, result);
              });
            })
            .catch(error => {
              console.error('Error updating documents:', error);
            });
        }
        if (req.body.country) {
            const countriesPath = path.join(__dirname, '..', 'staticData', 'countries.json');
            const countriesData = JSON.parse(fs.readFileSync(countriesPath, 'utf8'));
    
            const country = countriesData.find(country => country.name === countryName);
            if (!country) {
                return res.status(400).json({ success: false, error: "The country is not valid" });
            }
            updateFields.country = {
                name: country.name,
                code: country.code 
            }
            changed++;
        }

        if (region) {
            if (!mongoose.Types.ObjectId.isValid(region._id)) {
                return res.status(400).json({ success: false, error: 'Region ID not valid' });
            } else {
                const existingRegion = await Region.findById(region._id);
                if (!existingRegion) {
                    return res.status(404).json({ success: false, error: "Region not found" });
                }
            }
            updateFields.region = region;
            changed++;
        }
 

        if (open) {
            updateFields.open = open;
            changed++;
        }

        if (modality) {
            updateFields.modality = modality;
            changed++;
        }

        if(description)
        {
            updateFields.description = description;
            changed++;
        }

        if (changed > 0) {
            updateFields.lastUpdateUser = {
                userId: lastUpdateUser._id,
                name: lastUpdateUser.name,
                email: lastUpdateUser.email
            };
            updateFields.lastUpdateDate = new Date();
        }
        await Site.findByIdAndUpdate({ _id: id }, updateFields);

        res.status(200).send({ success: true, message: 'Site updated successfully'});
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
            const existingRegion = await Site.findById(id);
            if (!existingRegion) {
                return res.status(404).json({ success: false, message: "Site not found" });
            }
        }
        const selectedSite = await Site.findById(id);
        res.status(200).send({ success:true, message:'Site found', data: selectedSite });
    } catch(error) {
        res.status(400).send({ success:false, message:error.message });
    }
};

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
        const allSites = await Site.find({});
        res.status(200).send({ success:true, message:'Sites listed successfully', data: allSites });
    } catch(error) {
        res.status(400).send({ success:false, message:error.message });
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
        const region = req.params.regionId;
        if (!mongoose.Types.ObjectId.isValid(region)) {
            return res.status(400).json({ success: false, error: 'Region ID is invalid' });
        } else {
            const existingRegion = await Region.findById(region);
            if (!existingRegion) {
                return res.status(404).json({ success: false, error: "Region not found" });
            } else {
                const selectedSites = await Site.find({ 'region._id': region });
                return res.status(200).json({ success: true, message: 'Sites found successfully', data: selectedSites });
            }
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const getSitesPerRegionOpen = async (req, res) => {
    try {
        const region = req.params.regionId;
        if (!mongoose.Types.ObjectId.isValid(region)) {
            return res.status(400).json({ success: false, error: 'Region ID is invalid' });
        } else {
            const existingRegion = await Region.findById(region);
            if (!existingRegion) {
                return res.status(404).json({ success: false, error: "Region not found" });
            } else {
                const selectedSites = await Site.find({ 'region._id': region, 'open': 0  });
                return res.status(200).json({ success: true, message: 'Sites listed successfully', data: selectedSites });
            }
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
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

module.exports = {
    createSite,
    updateSite,
    getSite,
    getSites,
    getCountries,
    getSitesPerRegion,
    getSitesPerRegionOpen,
    deleteSite,
    changeStatus,
    updateDescription
};