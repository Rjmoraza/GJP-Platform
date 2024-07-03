const GameJam = require('../models/gameJamEventModel');
const User = require('../models/userModel');
const Stage = require('../models/stageModel');
const Team = require('../models/teamModel');
const Theme = require("../models/themeModel");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const createGameJam = async (req, res) => {
    const { edition, themes } = req.body;
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);

        const existingEditionCount = await GameJam.countDocuments({ edition: edition });
        if (existingEditionCount > 0) {
            return res.status(400).json({ success: false, error: 'Edition already exists' });
        }

        for (const theme of themes) {

            if (!mongoose.Types.ObjectId.isValid(theme._id)) {

                return res.status(400).json({ success: false, error: 'The provided theme ID is not valid.' });
            }

            const existingTheme = await Theme.findById(theme._id);
            if (!existingTheme) {
                return res.status(404).json({ success: false, error: "That theme does not exist." });
            }
        }


        const gameJam = new GameJam({
            edition: edition,
            themes: themes,
            creatorUser: {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            creationDate: new Date()
        });

        await gameJam.save();

        res.status(200).json({ success: true, msg: 'GameJam created successfully.', gameJamId: gameJam._id });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};


const updateGameJam = async (req, res) => {
    const id = req.params.id;
    const { edition, themes } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'The provided ID is not valid.' });
        }

        let gameJam = await GameJam.findById(id);
        console.log(id)
        console.log(gameJam)


        if (!gameJam) {
            return res.status(404).json({ success: false, error: 'GameJam not found.' });
        }

        if (edition) {

            gameJam.edition = edition;
            const query = { 'gameJam._id': id };

            const updateFieldsQuery = { $set: { 'gameJam.edition': edition } };

            const updatePromises = [];

            updatePromises.push(
                Stage.updateMany(query, updateFieldsQuery),
                Team.updateMany(query, updateFieldsQuery)
            );

            Promise.all(updatePromises)
                .then(results => {
                    results.forEach((result, index) => {
                        const modelNames = ['Stage', 'Team'];
                        console.log(`${modelNames[index]} documents updated successfully:`, result);
                    });
                })
                .catch(error => {
                    console.error('Error updating documents:', error);
                });
        }

        if (themes) {
            for (const theme of themes) {
                if (!mongoose.Types.ObjectId.isValid(theme._id)) {

                    return res.status(400).json({ success: false, error: 'The provided theme ID is not valid.' });
                }

                const existingTheme = await Theme.findById(theme._id);
                if (!existingTheme) {
                    return res.status(404).json({ success: false, error: "That theme does not exist." });
                }
            }

            gameJam.themes = themes

        }

        await gameJam.save();
        res.status(200).json({ success: true, msg: 'GameJam updated successfully.' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const getGameJam = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de GameJam proporcionado no es válido.' });
        } else {
            const existingGameJam = await GameJam.findById(id);
            if (!existingGameJam) {
                return res.status(404).json({ success: false, error: "Esa GameJam no existe" });
            }
        }
        const selectedGameJam = await GameJam.findById(id);
        res.status(200).send({ success: true, msg: 'GameJam encontrada correctamente', data: selectedGameJam });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getCurrentGameJam = async (req, res) => {
    try {
        const currentDate = new Date();

        const allGameJams = await GameJam.find({});

        const currentGameJam = allGameJams.find(gameJam => {
            return gameJam.stages.some(stage => {
                return currentDate >= stage.startDate && currentDate <= stage.endDate;
            });
        });

        if (currentGameJam) {
            res.status(200).send({ success: true, msg: 'Current Game Jam found', data: currentGameJam });
        } else {
            res.status(404).send({ success: false, msg: 'No current Game Jam found' });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getGameJamToEvaluate = async (req, res) => {
    try {
        const currentDate = new Date();

        const allGameJams = await GameJam.find({});

        const currentGameJam = allGameJams.find(gameJam => {
            return gameJam.stages.some(stage => {
                return currentDate >= stage.startDateEvaluation && currentDate <= stage.endDateEvaluation;
            });
        });

        if (currentGameJam) {
            res.status(200).send({ success: true, msg: 'Current Game Jam found', data: currentGameJam });
        } else {
            res.status(404).send({ success: false, msg: 'No current Game Jam found' });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getGameJams = async (req, res) => {
    try {
        const allGameJams = await GameJam.find({});
        res.status(200).send({ success: true, msg: 'Se han encontrado GameJams en el sistema', data: allGameJams });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const deleteGameJam = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedGameJam = await GameJam.findOneAndDelete({ _id: id });
        const query = { 'gameJam._id': id };

        const deletePromises = [];

        deletePromises.push(
            Stage.deleteMany(query),
            Team.deleteMany(query)
        );

        Promise.all(deletePromises)
            .then(results => {
                results.forEach((result, index) => {
                    const modelNames = ['Stage', 'Team'];
                    console.log(`${modelNames[index]} documents deleted successfully:`, result);
                });
            })
            .catch(error => {
                console.error('Error deleting documents:', error);
            });
        res.status(200).send({ success: true, msg: 'GameJam deleted successfully', data: deletedGameJam });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getTimeRemaining = async (req, res) => {
    try {
        const currentDate = new Date();

        const allGameJams = await GameJam.find({});

        const currentGameJam = allGameJams.find(gameJam => {
            return gameJam.stages.some(stage => {
                return currentDate >= stage.startDate && currentDate <= stage.endDate;
            });
        });
        if (!currentGameJam) {
            return res.status(200).json({ success: true, msg: 'No active stages found in this gameJam', timeRemaining: '0:0:0:0' });
        }
        const gameJamId = currentGameJam._id;
        if (!mongoose.Types.ObjectId.isValid(gameJamId)) {
            return res.status(400).json({ success: false, error: 'The provided gameJam ID is not valid.' });
        } else {
            const gameJam = await GameJam.findById(gameJamId).populate('stages._id');
            if (!gameJam) {
                return res.status(404).json({ success: false, error: "That gameJam does not exist" });
            }

            const currentDate = new Date();
            let closestStage;
            let closestTimeDifference = Infinity;

            for (const stage of gameJam.stages) {
                const startDate = new Date(stage.startDate);
                const endDate = new Date(stage.endDate);

                if (currentDate < startDate) {
                    const timeDifference = startDate - currentDate;
                    if (timeDifference < closestTimeDifference) {
                        closestTimeDifference = timeDifference;
                        closestStage = stage;
                    }
                } else if (currentDate >= startDate && currentDate <= endDate) {
                    closestStage = stage;
                    break;
                }
            }

            if (closestStage) {
                const startDate = new Date(closestStage.startDate);
                const endDate = new Date(closestStage.endDate);

                if (currentDate < startDate) {
                    const timeInMilliseconds = startDate - currentDate;
                    const days = Math.floor(timeInMilliseconds / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeInMilliseconds % (1000 * 60)) / 1000);
                    const timeRemaining = `${days}:${hours}:${minutes}:${seconds}`;
                    return res.status(200).json({ success: true, msg: 'The stage has not started yet', timeRemaining });
                } else if (currentDate >= startDate && currentDate <= endDate) {
                    const timeInMilliseconds = endDate - currentDate;
                    const days = Math.floor(timeInMilliseconds / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeInMilliseconds % (1000 * 60)) / 1000);
                    const timeRemaining = `${days}:${hours}:${minutes}:${seconds}`;
                    return res.status(200).json({ success: true, msg: 'The stage is in progress', timeRemaining });
                }
            }

            return res.status(200).json({ success: true, msg: 'No active stages found in this gameJam', timeRemaining: '0:0:0:0' });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getTimeRemainingEvaluation = async (req, res) => {
    try {
        const currentDate = new Date();

        const allGameJams = await GameJam.find({});

        const currentGameJam = allGameJams.find(gameJam => {
            return gameJam.stages.some(stage => {
                return currentDate >= stage.startDateEvaluation && currentDate <= stage.endDateEvaluation;
            });
        });
        if (!currentGameJam) {
            return res.status(200).json({ success: true, msg: 'No active stages found in this gameJam', timeRemaining: '0:0:0:0' });
        }
        const gameJamId = currentGameJam._id;
        if (!mongoose.Types.ObjectId.isValid(gameJamId)) {
            return res.status(400).json({ success: false, error: 'The provided gameJam ID is not valid.' });
        } else {
            const gameJam = await GameJam.findById(gameJamId).populate('stages._id');
            if (!gameJam) {
                return res.status(404).json({ success: false, error: "That gameJam does not exist" });
            }

            const currentDate = new Date();
            let closestStage;
            let closestTimeDifference = Infinity;

            for (const stage of gameJam.stages) {
                const startDate = new Date(stage.startDateEvaluation);
                const endDate = new Date(stage.endDateEvaluation);

                if (currentDate < startDate) {
                    const timeDifference = startDate - currentDate;
                    if (timeDifference < closestTimeDifference) {
                        closestTimeDifference = timeDifference;
                        closestStage = stage;
                    }
                } else if (currentDate >= startDate && currentDate <= endDate) {
                    closestStage = stage;
                    break;
                }
            }

            if (closestStage) {
                const startDate = new Date(closestStage.startDateEvaluation);
                const endDate = new Date(closestStage.endDateEvaluation);

                if (currentDate < startDate) {
                    const timeInMilliseconds = startDate - currentDate;
                    const days = Math.floor(timeInMilliseconds / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeInMilliseconds % (1000 * 60)) / 1000);
                    const timeRemaining = `${days}:${hours}:${minutes}:${seconds}`;
                    return res.status(200).json({ success: true, msg: 'The stage has not started yet', timeRemaining });
                } else if (currentDate >= startDate && currentDate <= endDate) {
                    const timeInMilliseconds = endDate - currentDate;
                    const days = Math.floor(timeInMilliseconds / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeInMilliseconds % (1000 * 60)) / 1000);
                    const timeRemaining = `${days}:${hours}:${minutes}:${seconds}`;
                    return res.status(200).json({ success: true, msg: 'The stage is in progress', timeRemaining });
                }
            }

            return res.status(200).json({ success: true, msg: 'No active stages found in this gameJam', timeRemaining: '0:0:0:0' });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

module.exports = {
    createGameJam,
    updateGameJam,
    getCurrentGameJam,
    getGameJamToEvaluate,
    getGameJam,
    getGameJams,
    deleteGameJam,
    getTimeRemaining,
    getTimeRemainingEvaluation
};