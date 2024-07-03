const Submission = require('../models/submissionModel');
const Stage = require('../models/stageModel');
const Category = require('../models/categoryModel');
const GameJam = require('../models/gameJamEventModel');
const Team = require('../models/teamModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Theme = require('../models/themeModel')
const { sendScore } = require('../services/mailer');

const createSubmission = async (req, res) => {
    const { description, pitch, game, teamId, categoryId, stageId, themeId, title } = req.body;
    try {
        const currentDate = new Date();

        if (!mongoose.Types.ObjectId.isValid(stageId)) {
            return res.status(400).json({ success: false, error: 'The provided stage ID is not valid.' });
        }

        const existingStage = await Stage.findById(stageId);
        if (!existingStage) {
            return res.status(404).json({ success: false, error: "That stage doesn't exist" });
        }

        if (currentDate < existingStage.startDate || currentDate > existingStage.endDate) {
            return res.status(400).json({ success: false, error: 'The current date is outside the allowed range for this stage.' });
        }

        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);

        let existingTeam;
        if (!mongoose.Types.ObjectId.isValid(teamId)) {
            return res.status(400).json({ success: false, error: 'The provided team ID is not valid.' });
        } else {
            existingTeam = await Team.findById(teamId);
            if (!existingTeam) {
                return res.status(404).json({ success: false, error: "That team doesn't exist" });
            }
        }

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ success: false, error: 'The provided category ID is not valid.' });
        } else {
            const existingCategory = await Category.findById(categoryId);
            if (!existingCategory) {
                return res.status(404).json({ success: false, error: "That category doesn't exist" });
            }
        }

        if (!mongoose.Types.ObjectId.isValid(themeId)) {
            return res.status(400).json({ success: false, error: 'The provided theme ID is not valid.' });
        } else {
            const existingCategory = await Theme.findById(themeId);
            if (!existingCategory) {
                return res.status(404).json({ success: false, error: "That theme doesn't exist" });
            }
        }

        const submission = new Submission({
            title: title,
            participating: 1,
            description: description,
            pitch: pitch,
            game: game,
            teamId: teamId,
            categoryId: categoryId,
            stageId: stageId,
            themeId: themeId,
            creatorUser: {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            creationDate: new Date()
        });

        await submission.save();

        existingTeam.submissions.push(submission._id);
        await existingTeam.save();

        existingTeam.lastSub = submission._id;
        await existingTeam.save();

        res.status(200).json({ success: true, msg: 'Submission created successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateSubmission = async (req, res) => {
    try {
        const { description, pitch, game, teamId, categoryId, themeId, stageId, title } = req.body;
        const id = req.params.id;
        const updateFields = {};
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const lastUpdateUser = await User.findById(userId);
        const existingSubmission = await Submission.findById(id);
        let changed = 0;

        const currentDate = new Date();

        if (!mongoose.Types.ObjectId.isValid(stageId)) {
            return res.status(400).json({ success: false, error: 'The provided stage ID is not valid.' });
        }

        const existingStage = await Stage.findById(stageId);
        if (!existingStage) {
            return res.status(404).json({ success: false, error: "That stage doesn't exist" });
        }

        if (currentDate < existingStage.startDate || currentDate > existingStage.endDate) {
            return res.status(400).json({ success: false, error: 'The current date is outside the allowed range for this stage.' });
        }

        if (description) {
            updateFields.description = description;
            changed++;
        }
        if (title) {
            updateFields.title = title;
            changed++;
        }

        if (pitch) {
            updateFields.pitch = pitch;
            changed++;
        }

        if (game) {
            updateFields.game = game;
            changed++;
        }

        if (teamId) {
            if (!mongoose.Types.ObjectId.isValid(teamId)) {
                return res.status(400).json({ success: false, error: 'The provided team ID is not valid.' });
            } else {
                const existingTeam = await Team.findById(teamId);
                if (!existingTeam) {
                    return res.status(404).json({ success: false, error: "That team doesn't exist" });
                }
            }
            await Team.updateOne(
                { _id: existingSubmission.gameJam },
                { $pull: { submissions: existingSubmission._id } }
            );
            await Team.updateOne(
                { _id: req.body.gameJamId },
                { $addToSet: { submissions: existingSubmission._id } }
            );

            updateFields.teamId = teamId;
            changed++;
        }

        if (categoryId) {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return res.status(400).json({ success: false, error: 'The provided category ID is not valid.' });
            } else {
                const existingCategory = await Category.findById(categoryId);
                if (!existingCategory) {
                    return res.status(404).json({ success: false, error: "That category doesn't exist" });
                }
            }
            updateFields.categoryId = categoryId;
            changed++;
        }

        if (themeId) {
            if (!mongoose.Types.ObjectId.isValid(themeId)) {
                return res.status(400).json({ success: false, error: 'The provided Theme ID is not valid.' });
            } else {
                const existingTheme = await Theme.findById(themeId);
                if (!existingTheme) {
                    return res.status(404).json({ success: false, error: "That theme doesn't exist" });
                }
            }
            updateFields.themeId = themeId;
            changed++;
        }

        if (stageId) {
            if (!mongoose.Types.ObjectId.isValid(stageId)) {
                return res.status(400).json({ success: false, error: 'The provided stage ID is not valid.' });
            } else {
                const existingStage = await Stage.findById(stageId);
                if (!existingStage) {
                    return res.status(404).json({ success: false, error: "That stage doesn't exist" });
                }
            }
            updateFields.stageId = stageId;
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
        await Submission.findByIdAndUpdate(id, updateFields);

        res.status(200).send({ success: true, msg: 'Submission updated successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getCurrentTeamSubmission = async (req, res) => {
    const { teamId, stageId } = req.params;

    try {
        const selectedSubmission = await Submission.findOne({ teamId: teamId, stageId: stageId });

        if (!selectedSubmission) {
            return res.status(404).json({ success: false, error: 'No submission found for the specified team and stage.' });
        }

        res.status(200).json({ success: true, msg: 'Submission found successfully.', data: selectedSubmission });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Error processing the request.' });
    }
};
const getSubmissionName = async (req, res) => {
    try {
        const name = req.params.name;

        if (!name) {
            return res.status(400).json({ success: false, error: 'Se requiere el nombre del juego.' });
        }

        const existingSubmission = await Submission.findOne({ title: name });
        if (!existingSubmission) {
            return res.status(404).json({ success: false, error: "Esa entrega no existe" });
        }

        res.status(200).send({ success: true, msg: 'Entrega encontrada correctamente', data: existingSubmission });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};


const getSubmission = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de entrega proporcionado no es válido.' });
        } else {
            const existingSubmission = await Submission.findById(id);
            if (!existingSubmission) {
                return res.status(404).json({ success: false, error: "Esa entrega no existe" });
            }
        }
        const selectedSubmission = await Submission.findById(id);
        res.status(200).send({ success: true, msg: 'Entrega encontrada correctamente', data: selectedSubmission });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getSubmissions = async (req, res) => {
    try {
        const allSubmissions = await Submission.find({});
        res.status(200).send({ success: true, msg: 'Se han encontrado entregas en el sistema', data: allSubmissions });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getSubmissionsSite = async (req, res) => {
    try {
        const siteId = req.params.id;
        
        const teams = await Team.find({ 'site._id': siteId });

        const teamIds = teams.map(team => team._id);

        const allSubmissions = await Submission.find({ teamId: { $in: teamIds } })
            .populate('teamId', 'studioName')
            .select('title teamId');

        const submissionsArray = allSubmissions.map(submission => ({
            id: submission._id,
            name: submission.title,
            team: submission.teamId.studioName
        }));

        res.status(200).send({ success: true, msg: 'Submissions found in the system', data: submissionsArray });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};
const getSubmissionsSiteName = async (req, res) => {
    try {
        const siteName = req.params.name;

        // Buscar equipos por nombre del sitio
        const teams = await Team.find({ 'site.name': { $regex: new RegExp(siteName, "i") } });
        const teamIds = teams.map(team => team._id);

        // Si no se encontraron equipos, enviar un mensaje de error
        if (teamIds.length === 0) {
            throw new Error('No teams found for the provided site name');
        }

        // Buscar presentaciones por los IDs de los equipos encontrados
        const allSubmissions = await Submission.find({ teamId: { $in: teamIds } })
            .populate('teamId', 'studioName')
            .select('title teamId');

        const submissionsArray = allSubmissions.map(submission => ({
            id: submission._id,
            name: submission.title,
            team: submission.teamId.studioName
        }));

        res.status(200).send({ success: true, msg: 'Submissions found in the system', data: submissionsArray });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};


const deleteSubmission = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedSubmission = await Submission.findOneAndDelete({ _id: id });

        if (deletedSubmission) {
            await Team.updateOne({ _id: deletedSubmission.team }, { $pull: { submissions: deletedSubmission._id } });

            res.status(200).send({ success: true, msg: 'Entrega eliminada correctamente', data: deletedSubmission });
        } else {
            res.status(404).json({ success: false, error: 'No se encontró la entrega con el ID proporcionado' });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const giveRating = async (req, res) => {
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;

        if (!userId) {
            return res.status(401).json({ success: false, msg: 'Unauthorized' });
        }

        const { submissionId,
            continuityPotential,
            audienceCompetitorAwarenessValue,
            marketPositioningValue,
            gameDesignCoreLoopValue,
            gameDesignHookValue,
            gameDesignBalanceValue,
            artVisualsCoherenceQualityValue,
            audioDesignCoherenceQualityValue,
            buildQualityValue,
            UIUXQualityValue,
            narrativeWorldBuildingValue,
            pitchFeedback,
            gameDesignFeedback,
            artVisualsFeedback,
            audioDesignFeedback,
            buildFeedback,
            personalFeedback
        } = req.body;

        const submission = await Submission.findById(submissionId);

        if (!submission) {
            return res.status(404).json({ message: 'El submission no fue encontrado.' });
        }

        const team = await Team.findById(submission.teamId);

        if (!team) {
            return res.status(404).json({ success: false, msg: 'Team not found' });
        }

        let evaluator = null;
        const evaluatorss = submission.evaluators;
        for (const e of evaluatorss) {
            if (e.userId == userId) {
                evaluator = e;
                break; 
            }
        }

        if (!evaluator) {
            return res.status(404).json({ message: 'Este juego no está asignado al usuario juez actual.' });
        }

        evaluator.continuityPotential = continuityPotential;
        evaluator.audienceCompetitorAwarenessValue = audienceCompetitorAwarenessValue;
        evaluator.marketPositioningValue = marketPositioningValue;
        evaluator.gameDesignCoreLoopValue = gameDesignCoreLoopValue;
        evaluator.gameDesignHookValue = gameDesignHookValue;
        evaluator.gameDesignBalanceValue = gameDesignBalanceValue;
        evaluator.artVisualsCoherenceQualityValue = artVisualsCoherenceQualityValue;
        evaluator.audioDesignCoherenceQualityValue = audioDesignCoherenceQualityValue;
        evaluator.buildQualityValue = buildQualityValue;
        evaluator.UIUXQualityValue = UIUXQualityValue;
        evaluator.narrativeWorldBuildingValue = narrativeWorldBuildingValue;
        evaluator.pitchFeedback = pitchFeedback;
        evaluator.gameDesignFeedback = gameDesignFeedback;
        evaluator.artVisualsFeedback = artVisualsFeedback;
        evaluator.audioDesignFeedback = audioDesignFeedback;
        evaluator.buildFeedback = buildFeedback;
        evaluator.personalFeedback = personalFeedback;

        await submission.save();

        /*const promises = [];

        for (const jammer of team.jammers) {
            const subject = 'Score Update on GameJam Platform';
            
            const emailPromise = sendScore(
                jammer.email,
                subject,
                continuityPotential,
                audienceCompetitorAwarenessValue,
                marketPositioningValue,
                gameDesignCoreLoopValue,
                gameDesignHookValue,
                gameDesignBalanceValue,
                artVisualsCoherenceQualityValue,
                audioDesignCoherenceQualityValue,
                buildQualityValue,
                UIUXQualityValue,
                narrativeWorldBuildingValue,
                pitchFeedback,
                gameDesignFeedback,
                artVisualsFeedback,
                audioDesignFeedback,
                buildFeedback,
                personalFeedback
            );
            promises.push(emailPromise);
        }        

        await Promise.all(promises);*/

        res.status(200).json({ success: true, msg: 'Juego calificado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
}


const getRating = async (req, res) => {
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;

        if (!userId) {
            return res.status(401).json({ success: false, msg: 'Unauthorized' });
        }

        const { submissionId } = req.params;

        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ message: 'The submission was not found.' });
        }

        let evaluator = null;
        const evaluators = submission.evaluators;
        for (const e of evaluators) {
            if (e.userId == userId) {
                evaluator = e;
                break; 
            }
        }
        if (!evaluator) {
            return res.status(404).json({ message: 'This game is not assigned to the current judge user.' });
        }

        const response = {
            continuityPotential: evaluator.continuityPotential,
            audienceCompetitorAwarenessValue: evaluator.audienceCompetitorAwarenessValue,
            marketPositioningValue: evaluator.marketPositioningValue,
            gameDesignCoreLoopValue: evaluator.gameDesignCoreLoopValue,
            gameDesignHookValue: evaluator.gameDesignHookValue,
            gameDesignBalanceValue: evaluator.gameDesignBalanceValue,
            artVisualsCoherenceQualityValue: evaluator.artVisualsCoherenceQualityValue,
            audioDesignCoherenceQualityValue: evaluator.audioDesignCoherenceQualityValue,
            buildQualityValue: evaluator.buildQualityValue,
            UIUXQualityValue: evaluator.UIUXQualityValue,
            narrativeWorldBuildingValue: evaluator.narrativeWorldBuildingValue,
            pitchFeedback: evaluator.pitchFeedback,
            gameDesignFeedback: evaluator.gameDesignFeedback,
            artVisualsFeedback: evaluator.artVisualsFeedback,
            audioDesignFeedback: evaluator.audioDesignFeedback,
            buildFeedback: evaluator.buildFeedback,
            personalFeedback: evaluator.personalFeedback
        };

        res.status(200).send({ success: true, msg: 'Rating found successfully', data: response });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};



const setEvaluatorToSubmission = async (req, res) => {
    try {
        const evaluatorId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;

        const creatorUser = await User.findById(evaluatorId);
        if (!creatorUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const currentDate = new Date();
        const allGameJams = await GameJam.find({});
        let stageIdFound = null;

        for (const gameJam of allGameJams) {
            for (const stage of gameJam.stages) {
                if (currentDate >= stage.startDateEvaluation && currentDate <= stage.endDateEvaluation) {
                    stageIdFound = stage._id;
                    break;
                }
            }
            if (stageIdFound) {
                break;
            }
        }

        if (!stageIdFound) {
            return res.status(404).json({ message: 'No active stage found.' });
        }

        const submissions = await Submission.find({ stageId: stageIdFound });

        if (submissions.length === 0) {
            return res.status(404).json({ message: 'No submissions available for evaluation in this stage.' });
        }

        let minCount = Infinity; 
        submissions.forEach(submission => {
            let count = 0;
            submission.evaluators.forEach(evaluator => {
                if (evaluator.pitchScore !== undefined) {
                    count++;
                }
            });
            if (count < minCount) {
                minCount = count;
            }
        });

        const submissionsWithMinEvaluators = submissions.filter(submission => {
            let count = 0;
            submission.evaluators.forEach(evaluator => {
                if (evaluator.pitchScore !== undefined) {
                    count++;
                }
            });
            return count === minCount;
        });

        const randomSubmission = submissionsWithMinEvaluators[Math.floor(Math.random() * submissionsWithMinEvaluators.length)];
        
        const existingEvaluator = randomSubmission.evaluators.find(evaluator => evaluator.userId.toString() === evaluatorId.toString());
        if (existingEvaluator) {
            return res.status(400).json({ message: 'Evaluator already associated.' });
        }        
        randomSubmission.evaluators.push({ userId: evaluatorId, name: creatorUser.name, email: creatorUser.email });
        await randomSubmission.save();

        res.status(200).json({ message: 'Evaluator successfully added to the submission.', data: randomSubmission });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred.' });
    }
};


const getSubmissionsEvaluator = async (req, res) => {
    try {
        const evaluatorID = req.params.id;
        const Submissions = await Submission.find({
            'evaluators.userId': evaluatorID,
            $or: [
                { "evaluators.UIUXQualityValue": null },
            ]
        });

        res.status(200).send({ success: true, msg: 'There are submissions in the system', data: Submissions });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Error while processing the request.' });
    }
};


const getRatingsEvaluator = async (req, res) => {
    try {
        const evaluatorID = req.params.id;
        const Submissions = await Submission.find({
            'evaluators.userId': evaluatorID,
            $and: [
                { "evaluators.UIUXQualityValue": { $exists: true, $ne: null } }
            ]
        });
        res.status(200).send({ success: true, msg: 'There are ratings in the system', data: Submissions });
    }
    catch {
        res.status(400).json({ success: false, error: 'Error processing the request.' });
    }
};



module.exports = {
    createSubmission,
    updateSubmission,
    getCurrentTeamSubmission,
    getSubmission,
    getSubmissions,
    getSubmissionsSite,
    deleteSubmission,
    setEvaluatorToSubmission,
    giveRating,
    getRating,
    getSubmissionsEvaluator,
    getRatingsEvaluator,
    getSubmissionsSiteName,
    getSubmissionName
};