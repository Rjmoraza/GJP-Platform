const Prize = require('../models/prizeModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const createPrize = async (req, res) => {
    const { name, price } = req.body;
    try {
        const existingPrize = await Prize.findOne({ name: name, price: price });
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);
        
        if (existingPrize) {
            return res.status(409).json({ success: false, error: "Ese premio ya existe" });
        }

        const prize = new Prize({
            name: name,
            price: price,
            creatorUser: {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            creationDate: new Date()
        });

        await prize.save();

        res.status(200).json({ success: true, msg: 'Se ha creado correctamente el premio' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updatePrize = async (req, res) => {
    try {
        const id = req.params.id;
        const updateFields = {};
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const lastUpdateUser = await User.findById(userId);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de premio proporcionado no es válido.' });
        } else {
            const existingPrize = await Prize.findById(id);
            if (!existingPrize) {
                return res.status(404).json({ success: false, error: "Ese premio no existe" });
            }
        }
        let changed = 0;
        if (req.body.name) {
            updateFields.name = req.body.name;
            changed++;
        }

        if (req.body.price) {
            updateFields.price = req.body.price;
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

        await Prize.findByIdAndUpdate({ _id: id }, updateFields);

        res.status(200).send({ success: true, msg: 'Se ha actualizado el premio correctamente'});
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};


const getPrize = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de premio proporcionado no es válido.' });
        } else {
            const existingPrize = await Prize.findById(id);
            if (!existingPrize) {
                return res.status(404).json({ success: false, error: "Ese premio no existe" });
            }
        }
        const selectedPrize = await Prize.findById(id);
        res.status(200).send({ success:true, msg:'Premio encontrado correctamente', data: selectedPrize });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const getPrizes = async(req,res)=>{
    try{
        const allPrizes = await Prize.find({});
        res.status(200).send({ success:true, msg:'Se han encontrado premios en el sistema', data: allPrizes });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const deletePrize = async(req,res)=>{
    try{
        const id = req.params.id;
        const deletedPrize = await Prize.findOneAndDelete({ _id: id });
        res.status(200).send({ success:true, msg:'Premio eliminado correctamente', data: deletedPrize });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

module.exports = {
    createPrize,
    updatePrize,
    getPrize,
    getPrizes,
    deletePrize
};