const User = require('../models/userModel');
const Team = require('../models/teamModel');
const Site = require('../models/siteModel');
const UserOnJam = require('../models/userOnJamModel');
const gamejamController = require('../controllers/gameJamController');
const { sendEmail } = require('../services/mailer');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const { deepEqual } = require('assert');

const registerUser = async (req, res) => {
    const { name, email, region, site, team, roles, coins, discordUsername } = req.body;

    try {
        // Validar email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(403).json({ success: false, message: 'Invalid email address.' });
        }

        // Verificar si el email ya está registrado
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(409).json({ success: false, message: "The email is already in use." });
        }

        // Verificar si el nombre de usuario de Discord ya está registrado
        const existingDiscordUsername = await User.findOne({ discordUsername: discordUsername });
        if (existingDiscordUsername) {
            return res.status(409).json({ success: false, message: "The Discord Username is already in use." });
        }

        // Crear nuevo usuario
        const user = new User({
            name: name,
            email: email,
            region: region ? { _id: region._id, name: region.name } : undefined,
            site: site ? { _id: site._id, name: site.name } : undefined,
            team: team ? { _id: team._id, name: team.name } : undefined,
            roles: roles,
            coins: coins,
            discordUsername: discordUsername,
            creationDate: new Date()
        });

        // Guardar usuario en la base de datos
        await user.save();
        res.status(200).json({ success: true, message: 'Registered successfully', userId: user._id });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, region, site, team, roles, coins, discordUsername } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID.' });
        }

        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (email && email !== existingUser.email) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(403).json({ success: false, message: 'Invalid email address.' });
            }
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(409).json({ success: false, message: 'The email is already in use.' });
            }
            existingUser.email = email;
        }

        if (name) existingUser.name = name;
        if (region) existingUser.region = { _id: region._id, name: region.name };
        if (site) existingUser.site = { _id: site._id, name: site.name };
        if (team) existingUser.team = { _id: team._id, name: team.name };
        if (roles) existingUser.roles = roles;
        if (coins) existingUser.coins = coins;
        if (discordUsername) existingUser.discordUsername = discordUsername;
        if(existingUser.roles.includes('Jammer')){
            const query = { 'jammers._id': id };

            const updateFieldsQuery = {
                $set: {
                    'jammers.$.name': name,
                    'jammers.$.email': email
                }
            };

            Team.updateMany(query, updateFieldsQuery)
                .then(result => {
                    console.log("Jammer fields updated successfully:", result);
                })
                .catch(error => {
                    console.error('Error updating Jammer fields:', error);
                });
        }


        /*if (rol === 'Jammer') {
            const query = { 'jammers._id': id };

            const updateFieldsQuery = {
                $set: {
                    'jammers.$.name': name,
                    'jammers.$.email': email
                }
            };

            Team.updateMany(query, updateFieldsQuery)
                .then(result => {
                    console.log("Jammer fields updated successfully:", result);
                })
                .catch(error => {
                    console.error('Error updating Jammer fields:', error);
                });
        }*/
        existingUser.lastUpdateDate = new Date();

        await existingUser.save();

        res.status(200).json({ success: true, message: 'User updated successfully.' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const loginUser = async (req, res) => {
    const email = req.body.email;
    const existingUser = await User.findOne({ email });
    let roles;
    let userId;

    if (!existingUser) {
        const registerLink = `http://${process.env.URL}/register`;
        const subject = 'Login in GameJam Platform';
        const message = `Hi, click on this link to create an account:`;
        const link = registerLink;
        await sendEmail(email, subject, message, link);
        res.status(200).json({ success: true, msg: `Register form sent to user's email`, email, registerLink });
    }
    else
    {
        roles = existingUser.roles;
        userId = existingUser._id;
    
        const token = jwt.sign({ userId, roles }, 'MY_JWT_SECRET', { expiresIn: 600000 });
        const magicLink = `http://${process.env.URL}/api/user/magic-link/${token}`;
        const subject = 'Login in GameJam Platform';
        const message = `Hi, click on this link to continue to the app:`;
        const link = magicLink;
        await sendEmail(email, subject, message, link);
        res.status(200).json({ success: true, msg: `Magic Link sent to user's email`, email, magicLink });
    }
};

const magicLink = async (req, res) => {
    try {
        const token = req.params.token;
        const decodedToken = jwt.verify(token, 'MY_JWT_SECRET');
        const userId = decodedToken.userId;
        const roles = decodedToken.roles;

        const newToken = jwt.sign({ userId, roles }, 'MY_JWT_SECRET');

        res.cookie('token', newToken, {
            httpOnly: false
        });
        let redirectUrl
        redirectUrl = `http://${process.env.URL}/home`;

        const rolesToCheck = ["LocalOrganizer", "GlobalOrganizer","Judge","Jammer"];
        const hasAnyRole = rolesToCheck.some(role => roles.includes(role));

        if(!hasAnyRole){
            return res.clearCookie('token').redirect(`http://${process.env.URL}/login`);
        }
        return res.redirect(redirectUrl);
    } catch (error) {
        //console.error('Error processing token:', error);
        //res.status(400).json({ success: false, error: 'Error processing token' });
        return res.clearCookie('token').redirect(`http://${process.env.URL}/login/error`);
    }
};

const logOutUser = async (req, res) => {
    try {
        res.clearCookie('token').status(200).json({ success: true, message: 'Cookie deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error deleting cookie' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User Not Found' });
        }

        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(400).json({ success: false, error: 'Error processing token' });
    }
};

const getLocalOrganizersPerSite = async (req, res) => {
    const { siteId } = req.params;
    try {
        var organizers = await User.find({ "site._id": siteId, roles: 'LocalOrganizer' });
        return res.status(200).send({ success: true, msg: "Organizers found for site ", data: organizers });
    } catch (error) {
        return res.status(400).send({ success: false, msg: error.message });
    }
};

const updateSite = async (req, res) => {
    const { id } = req.params;
    const { siteId } = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, { site: siteId }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getStaffPerSite = async (req, res) => {
    const { siteId } = req.params;
    try {
        const staff = await User.find({ 
            "roles" : "LocalOrganizer",
            "site._id" : siteId
        })
        res.status(200).send({ success: true, msg: 'Staff have been found in the system.', data: staff });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});
        res.status(200).send({ success: true, msg: 'Users found in the system', data: allUsers });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getJammersPerSite = async (req, res) => {
    const { siteId, jamId } = req.params;
    try {
        const jammersOnSite = await UserOnJam.find({
            siteId: siteId,
            jamId: jamId
        });

        if(jammersOnSite.length == 0) return res.status(404).send({ success: false, message: 'No jammers found for this venue'});

        let jammerIds = new Array();
        jammersOnSite.forEach((jos) => {
            jammerIds.push(jos.userId);
        });

        const jammers = await User.find({
            _id: { "$in": jammerIds }
        });

        res.status(200).send({ success: true, msg: 'Users with the role "Jammer" have been found in the system.', data: jammers });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const getJammersNotInTeamPerSite = async (req, res) => {
    const siteId = req.params.siteId;
    try {
        const jammersNotInTeam = await User.find({ "site._id": siteId, team: null, roles: 'Jammer' });
        res.status(200).send({ success: true, msg: 'Users with the role "Jammer" who are not in any team have been found in the system.', data: jammersNotInTeam });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await User.findOneAndDelete({ _id: id });
        const query = { 'jammers._id': id };

        const updateFieldsQuery = {
            $pull: {
                'jammers': { '_id': id }
            }
        };

        Team.updateMany(query, updateFieldsQuery)
            .then(result => {
                console.log("Jammer removed successfully:", result);
            })
            .catch(error => {
                console.error('Error removing Jammer:', error);
            });

        res.status(200).send({ success: true, message: 'User removed correctly', data: deletedUser });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

const registerUsersFromCSV = async (req, res) => {
    try {
        const registrationResults = [];
        const errorLog = [];
        const currentDate = new Date();

        const evaluatorId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const creatorUser = await User.findById(evaluatorId);

        if (!creatorUser) {
            return res.status(401).json({ success: false, error: 'Invalid user' });
        }

        if(req.body.data)
        {
            const users = [];
            req.body.data.forEach(record =>{
                users.push({
                    name: record.name,
                    email: record.email,
                    roles: ['Jammer'],
                    discordUsername: record.discord,
                    team: record.team
                });
            });

            const site = await Site.findById(creatorUser.site._id);
            const region = creatorUser.region;            

            // TODO REFACTOR GAMEJAM CONTROLLER AND CREATE A FIND CURRENT GAMEJAM FUNCTION
            // Find the current gamejam
            const currentGameJam = await gamejamController.findCurrentGameJam();
            if (!currentGameJam) {
                errorLog.push('No active game jam found');
                return res.status(200).json({ success: false, error: errorLog });
            }

            // Add users to the jam
            for (const userData of users){
                // Check if the email is correct
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
                    errorLog.push(`Invalid email address for user: ${userData.name} (${userData.email}, ${userData.discordUsername})`);
                    continue;
                }

                // Check if this user's email already exists
                const existingEmail = await User.findOne({ email: userData.email });
                if (existingEmail) {
                    errorLog.push(`The email is already in use for user: ${userData.name} (${userData.email}, ${userData.discordUsername})`);
                    continue;
                }

                console.log("Email does not exist");

                // Check if this user's discord already exists
                let userDiscord = userData.discordUsername;
                const existingDiscordUsername = await User.findOne({ discordUsername: userData.discordUsername });
                if (existingDiscordUsername) {
                    errorLog.push(`The Discord Username is already in use for user: ${userData.name} (${userData.email}, ${userData.discordUsername})`);
                    continue;
                }

                console.log("Discord does not exist");

                // Find the team or create a new one
                let team = null;
                if(userData.team != "None") 
                {
                    team = await Team.findOne({ studioName: userData.team });
                    if (!team) {
                        team = new Team({
                            studioName: userData.team,
                            description: 'No Description',
                            stage: 0,
                            region: { _id: region._id, name: region.name },
                            site: { _id: site._id, name: site.name },
                            linkTree: [],
                            gameJam: { _id: currentGameJam._id, edition: currentGameJam.edition },
                            creatorUser: {
                                userId: creatorUser._id,
                                name: creatorUser.name,
                                email: creatorUser.email
                            },
                            jammers: [],
                            creationDate: new Date(),
                            lastUpdateDate: new Date()
                        });
                        await team.save();
                    } else if (team.site._id.toString() !== site._id.toString()) {
                        errorLog.push(`The team is in a different site for user: ${name} (${email}, ${discordUsername})`);
                        continue;
                    }
                }
                
                const jammer = await User.create({
                    name: userData.name,
                    email: userData.email,
                    region: { _id: region._id, name: region.name },
                    site: { _id: site._id, name: site.name },
                    roles: ["Jammer"],
                    coins: 0,
                    discordUsername: userData.discordUsername,
                    creationDate: new Date()
                });
    
                if (team.region._id.toString() === region._id.toString()) {
                    team.jammers.push({ 
                        _id: jammer._id, 
                        name: jammer.name, 
                        email: jammer.email, 
                        discordUsername: jammer.discordUsername 
                    });
                    await team.save();
                }

                registrationResults.push(`Registered successfully for user: ${userData.name} (${userData.email}, ${userData.discordUsername})`);
            }
            console.log("End of user registration");
        }
        return res.status(200).json({ success: true, msg: 'User registration completed.', registrationResults, errorLog });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

const addRol = async (req, res) => {
    const userId = req.params.id;
    const {rol} = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.roles.includes(rol)) {
            return res.status(400).json({ message: 'User already has role' });
        }
        user.roles.push(rol)
        await user.save();
        return res.status(200).json({ success: true, message: "Role added successfully" })
    }
    catch(error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const deleteRol = async (req, res) => {
    const userId = req.params.id;
    const {rol} = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (!user.roles.includes(rol)) {
            return res.status(400).json({ message: `User doesn't have that role` });
        }
        user.roles = user.roles.filter(r => r !== rol);
            await user.save();
            return res.status(200).json({ success: true, message: "Rol removed successfully" })
    }
    catch(error){
        res.status(500).json({ success: false, error: error.message });
    }
};

const validateUser = async (req) => {
    try{
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        return null;
    }
};


module.exports = {
    registerUser,
    updateUser,
    deleteUser,
    loginUser,
    getCurrentUser,
    magicLink,
    logOutUser,
    updateSite,
    getLocalOrganizersPerSite,
    getUsers,
    getJammersPerSite,
    getJammersNotInTeamPerSite,
    getStaffPerSite,
    registerUsersFromCSV,
    addRol,
    deleteRol,
    validateUser
};