const Team = require('../models/teamModel');
const GameJam = require('../models/gameJamEventModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Site = require('../models/siteModel');
const Region = require('../models/regionModel');

const createTeam = async (req, res) => {
    const { studioName, description, gameJam, linkTree, jammers, site, region } = req.body;
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);
        if (!gameJam || !gameJam._id || !mongoose.Types.ObjectId.isValid(gameJam._id)) {
            return res.status(400).json({ success: false, error: 'The provided GameJam is invalid.' });
        }

        const existingGameJam = await GameJam.findById(gameJam._id);
        if (!existingGameJam) {
            return res.status(404).json({ success: false, error: "That GameJam does not exist" });
        }

        const existingSite = await Site.findById(site._id);
        if (!existingSite) {
            return res.status(404).json({ success: false, error: "That site does not exist" });
        }
        const existingRegion = await Region.findById(region._id);
        if (!existingRegion) {
            return res.status(404).json({ success: false, error: "That region does not exist" });
        }

        for (const jammer of jammers) {
            const user = await User.findById(jammer._id);
            if (user.team && user.team._id) {
                return res.status(403).json({ success: false, error: `User ${user.name} (${user.email}) is already assigned to a team.` });
            }
        }        

        const createdTeam = new Team({
            studioName: studioName,
            description: description,
            stage: 0,
            site: {
                _id: existingSite._id,
                name: existingSite.name
            },
            region: {
                _id: existingRegion._id,
                name: existingRegion.name
            },
            gameJam: {
                _id: existingGameJam._id,
                edition: existingGameJam.edition
            },
            linkTree: linkTree,
            jammers: jammers.map(jammer => ({
                _id: jammer._id,
                name: jammer.name,
                email: jammer.email,
                discordUsername: jammer.discordUsername
            })),
            creatorUser: {
                userId: creatorUser._id,
                name: creatorUser.name,
                email: creatorUser.email
            },
            creationDate: new Date()
        });

        const savedTeam = await createdTeam.save();

        await Promise.all(jammers.map(async jammer => {
            const user = await User.findById(jammer._id);
            if (!user) {
                console.log(`No se encontró el usuario con ID: ${jammer._id}`);
                return;
            }

            user.team = {
                _id: savedTeam._id,
                name: savedTeam.studioName
            };
            await user.save();
        }));

        res.status(200).json({ success: true, msg: 'Team created successfully', team: savedTeam });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateTeam = async (req, res) => {
    const teamId = req.params.id;
    const {studioName, description, gameJam, linkTree, jammers, site, region } = req.body;
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(userId);
        if (!gameJam || !gameJam._id || !mongoose.Types.ObjectId.isValid(gameJam._id)) {
            return res.status(400).json({ success: false, error: 'The provided GameJam is invalid.' });
        }

        const existingTeam = await Team.findById(teamId);
        if (!existingTeam) {
            return res.status(404).json({ success: false, error: "That team does not exist" });
        }

        const regionChanged = existingTeam.region._id.toString() !== region._id;
        const siteChanged = existingTeam.site._id.toString() !== site._id;

        if (regionChanged || siteChanged) {
            for (const jammer of existingTeam.jammers) {
                    const user = await User.findById(jammer._id);
                    if (user) {
                        user.team = null;
                        await user.save();
                    }
            }
            existingTeam.jammers = [];
        }

        for (const jammer of jammers) {
            const user = await User.findById(jammer._id);
            if (user.team && user.team._id && user.team._id.toString() !== existingTeam._id.toString()) {
                return res.status(403).json({ success: false, error: `User ${user.name} (${user.email}) is already assigned to a different team.` });
            }
        }
        if(req.body.studioName) {
            const query = { 'team._id': teamId };

            const updateFieldsQuery = { $set: { 'team.name': studioName } };

            const updatePromises = [];

            updatePromises.push(
              User.updateMany(query, updateFieldsQuery)
            );
            
            Promise.all(updatePromises)
            .then(results => {
              results.forEach((result, index) => {
                const modelNames = ['User'];
                console.log(`${modelNames[index]} documents updated successfully:`, result);
              });
            })
            .catch(error => {
              console.error('Error updating documents:', error);
            });
        }
        existingTeam.studioName = studioName;
        existingTeam.description = description;
        existingTeam.gameJam = {
            _id: gameJam._id,
            edition: gameJam.edition
        };
        existingTeam.site = {
            _id: site._id,
            name: site.name
        };
        existingTeam.region = {
            _id: region._id,
            name: region.name
        };
        existingTeam.linkTree = linkTree;
        existingTeam.lastUpdateDate = new Date();
        existingTeam.lastUpdateUser = {
            userId: creatorUser._id,
            name: creatorUser.name,
            email: creatorUser.email
        };

        for (const jammer of existingTeam.jammers) {
            const foundJammer = jammers.find(j => j._id === jammer._id);
            if (!foundJammer) {
                const user = await User.findById(jammer._id);
                if (user) {
                    user.team = null;
                    await user.save();
                }
            }
        }

        existingTeam.jammers = jammers.map(jammer => ({
            _id: jammer._id,
            name: jammer.name,
            email: jammer.email,
            discordUsername: jammer.discordUsername
        }));

        const updatedTeam = await existingTeam.save();

        await Promise.all(jammers.map(async jammer => {
            const user = await User.findById(jammer._id);
            if (!user) {
                console.log(`No se encontró el usuario con ID: ${jammer._id}`);
                return;
            }
            
            user.team = {
                _id: updatedTeam._id,
                name: studioName
            };
            await user.save();
        }));

        res.status(200).json({ success: true, msg: 'Team updated successfully', team: updatedTeam });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const getTeam = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'El ID de equipo proporcionado no es válido.' });
        } else {
            const existingTeam = await Team.findById(id);
            if (!existingTeam) {
                return res.status(404).json({ success: false, error: "Ese equipo no existe" });
            }
        }
        const selectedTeam = await Team.findById(id);
        res.status(200).send({ success:true, msg:'Equipo encontrado correctamente', data: selectedTeam });
    } catch(error) {
        res.status(400).send({ success:false, msg:error.message });
    }
};

const getTeams = async (req, res) => {
    try {
        const allTeams = await Team.find({});
        res.status(200).send({ success: true, msg: 'Teams have been found in the system', data: allTeams });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const deleteTeam = async (req, res) => {
    try {
        const id = req.params.id;

        const existingTeam = await Team.findById(id);
        if (!existingTeam) {
            return res.status(404).json({ success: false, error: 'No team found with the provided ID' });
        }

        for (const jammer of existingTeam.jammers) {
            const user = await User.findById(jammer._id);
            if (user) {
                user.team = null;
                await user.save();
            }
        }

        const deletedTeam = await Team.findOneAndDelete({ _id: id });

        if (deletedTeam) {
            res.status(200).send({ success: true, msg: 'Team deleted successfully', data: deletedTeam });
        } else {
            res.status(404).json({ success: false, error: 'No team found with the provided ID' });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};


const getTeamSite = async (req, res) => {
    try {
        const siteName = req.params.site;
        if (!siteName) {
            return res.status(400).send({ success: false, msg: "Site name is required" });
        }

        const teams = await Team.find({ 'site.name': siteName });
        return res.status(200).send({ success: true, msg: `Teams found for site ${siteName}`, data: teams });
    } catch (error) {
        return res.status(500).send({ success: false, msg: error.message });
    }
};


const addJammerToTeam = async (req, res) => {
    const teamId = req.params.teamId;
    const jammerId= req.params.jammerId;

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, error: "Team not found" });
        }

        const jammer = await User.findById(jammerId);
        if (!jammer) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        if (jammer.team._id) {
            return res.status(409).json({ success: false, error: "Jammer already belongs to a team" });
        }

        team.jammers.push({
            _id: jammer._id,
            name: jammer.name,
            email: jammer.email,
            discordUsername: jammer.discordUsername
        });
        await team.save();

        jammer.team = {
            _id: team._id,
            name: team.studioName
        };
        await jammer.save();

        res.status(200).json({ success: true, msg: 'Jammer added to team successfully', team });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const removeJammerFromTeam = async (req, res) => {
    const teamId = req.params.teamId;
    const jammerId = req.params.jammerId;

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, error: "Team not found" });
        }

        const jammerIndex = team.jammers.findIndex(jammer => jammer._id.toString() === jammerId);
        if (jammerIndex === -1) {
            return res.status(404).json({ success: false, error: "Jammer not found in team" });
        }

        const jammer = await User.findById(jammerId);
        if (!jammer) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        team.jammers.splice(jammerIndex, 1);
        await team.save();

        jammer.team = null;
        await jammer.save();

        res.status(200).json({ success: true, msg: 'Jammer removed from team successfully', team });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = {
    createTeam,
    updateTeam,
    getTeam,
    getTeams,
    deleteTeam,
    getTeamSite,
    addJammerToTeam,
    removeJammerFromTeam
};