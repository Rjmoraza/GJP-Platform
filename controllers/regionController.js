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
            return res.status(409).json({ success: false, message: "Region already exists!" });
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

        res.status(200).json({ success: true, message: 'Region created successfully!', regionId: region._id });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateRegion = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const lastUpdateUser = await User.findById(userId);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'The provided region ID is not valid!' });
        } else {
            const existingRegion = await Region.findOne({ name: req.body.name });
            if (existingRegion && existingRegion._id.toString() !== id) {
                return res.status(409).json({ success: false, message: 'A region with that name already exists!' });
            }
        }

        let region = await Region.findOne({ _id: req.params.id });
        region.name = req.body.name;
        await region.save();
        
        res.status(200).json({ success: true, message: 'Region updated successfully!' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
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
        res.status(200).send({ success:true, message:'Se han encontrado regiones en el sistema', data: allRegions });
    } catch(error) {
        res.status(400).send({ success:false, message:error.message });
    }
};

const deleteRegion = async(req, res) => {
    try {
        const id = req.params.id;
        const siteCount = await Site.countDocuments({ 'region._id':id });
        const userCount = await User.countDocuments({ 'region._id':id });

        if(siteCount > 0)
        {
            return res.status(400).send({ success: false, message: 'Cannot delete a region that has sites linked to it' });
        }
        else if(userCount > 0)
        {
            return res.status(400).send({ success: false, message: 'Cannot delete a region that has users linked to it' });
        }
        else
        {
            const deletedRegion = await Region.findOneAndDelete({ _id: id });
            return res.status(200).send({ success: true, message: 'Region deleted successfully', data: deletedRegion });
        }
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