const Region = require('../models/regionModel');
const User = require('../models/userModel');
const Site = require('../models/siteModel');
const GameJam = require('../models/gameJamEventModel');
const Team = require('../models/teamModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const createRegion = async (req, res) => {
    const { name } = req.body;
    try {
        const existingRegion = await Region.findOne({ name: name });
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);
        
        if (existingRegion) {
            return res.status(409).json({ success: false, error: "Region already exists!" });
        }

        const region = new Region({
            name: name,
            creatorUser: {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            creationDate: new Date()
        });

        await region.save();

        res.status(200).json({ success: true, msg: 'Region created successfully!', regionId: region._id });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateRegion = async (req, res) => {
    try {
        const id = req.params.id;
        const updateFields = {};
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const lastUpdateUser = await User.findById(userId);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'The provided region ID is not valid!' });
        } else {
            const existingRegion = await Region.findOne({ name: req.body.name });
            if (existingRegion && existingRegion._id.toString() !== id) {
                return res.status(409).json({ success: false, error: 'A region with that name already exists!' });
            }
        }

        if (req.body.name) {
            updateFields.name = req.body.name;
            updateFields.lastUpdateUser = {
                userId: lastUpdateUser._id,
                name: lastUpdateUser.name,
                email: lastUpdateUser.email
            }
            updateFields.lastUpdateDate = new Date();
            const query = { 'region._id': id };

            const updateFieldsQuery = { $set: { 'region.name': req.body.name } };

            const updatePromises = [];

            updatePromises.push(
              User.updateMany(query, updateFieldsQuery),
              GameJam.updateMany(query, updateFieldsQuery),
              Team.updateMany(query, updateFieldsQuery),
              Site.updateMany(query, updateFieldsQuery)
            );
            
            Promise.all(updatePromises)
            .then(results => {
              results.forEach((result, index) => {
                const modelNames = ['User', 'GameJam', 'Team', 'Site'];
                console.log(`${modelNames[index]} documents updated successfully:`, result);
              });
            })
            .catch(error => {
              console.error('Error updating documents:', error);
            });
        }

        await Region.findByIdAndUpdate(id, updateFields);

        res.status(200).json({ success: true, msg: 'Region updated successfully!' });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};


const getRegion = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de región proporcionado no es válido.' });
        } else {
            const existingRegion = await Region.findById(id);
            if (!existingRegion) {
                return res.status(404).json({ success: false, error: "Esa región no existe" });
            }
        }
        const selectedRegion = await Region.findById(id);
        res.status(200).send({ success:true, msg:'Región encontrada correctamente', data: selectedRegion });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const getRegions = async(req,res)=>{
    try{
        const allRegions = await Region.find({});
        res.status(200).send({ success:true, msg:'Se han encontrado regiones en el sistema', data: allRegions });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const deleteRegion = async(req, res) => {
    try {
        const id = req.params.id;
        const deletedRegion = await Region.findOneAndDelete({ _id: id });
        const query = { 'region._id': id };

        const deletePromises = [];
        
        deletePromises.push(
            User.deleteMany(query),
            GameJam.deleteMany(query),
            Team.deleteMany(query),
            Site.deleteMany(query)
        );
        
        Promise.all(deletePromises)
            .then(results => {
                results.forEach((result, index) => {
                    const modelNames = ['User', 'GameJam', 'Team', 'Site'];
                    console.log(`${modelNames[index]} documents deleted successfully:`, result);
                });
            })
            .catch(error => {
                console.error('Error deleting documents:', error);
            });        
        res.status(200).send({ success: true, msg: 'Region deleted successfully', data: deletedRegion });
    } catch(error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

module.exports = {
    createRegion,
    updateRegion,
    getRegion,
    getRegions,
    deleteRegion
};