// Importar los módulos necesarios
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv').config();
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');


// Crear una instancia de la aplicación Express
const app = express();
const port = 3000; // Establecer el puerto en el que el servidor escuchará las solicitudes

// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/GameJamDB");

/*
// Configuración de CORS - Permite solicitudes desde un origen específico
const corsOptions = {
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);

        const allowedOrigins = ['http://localhost:3000/', 'http://localhost:4200','http://149.130.176.112'];
        if (allowedOrigins.indexOf(origin) !== -1) {
            // El origen está en la lista de orígenes permitidos
            callback(null, true);
        } else {
            // El origen no está en la lista de orígenes permitidos
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 204, // Devolver un código de éxito 204
    methods: "GET, POST, PUT, DELETE", // Permitir estos métodos HTTP
    credentials: true, // Permite enviar cookies de forma segura
};

app.use(cors(corsOptions)); // Usar el middleware CORS

*/

// Middleware para analizar solicitudes JSON y cookies
app.use(express.json());
app.use(cookieParser());

// Definir las rutas de la API para diferentes recursos

// Rutas de usuarios
const user_route = require('./routes/userRoute');
app.use('/api/user', user_route);

// Rutas de chat
const chat_route = require('./routes/chatRoute')
app.use('/api/chat', chat_route);

// Rutas de regiones
const region_route = require('./routes/regionRoute');
app.use('/api/region', region_route);

// Rutas de premios
const prize_route = require('./routes/prizeRoute');
app.use('/api/prize', prize_route);

// Rutas de sites
const site_route = require('./routes/siteRoute');
app.use('/api/site', site_route);

// Rutas de categorías
const category_route = require('./routes/categoryRoute');
app.use('/api/category', category_route);

// Rutas de GameJams
const game_jam_route = require('./routes/gameJamRoute');
app.use('/api/game-jam', game_jam_route);

// Rutas de fases
const stage_route = require('./routes/stageRoute');
app.use('/api/stage', stage_route);

// Rutas de equipos
const team_route = require('./routes/teamRoute');
app.use('/api/team', team_route);

// Rutas de entregables
const submission_route = require('./routes/submissionRoute');
app.use('/api/submission', submission_route);

// Rutas de temas
const theme_route = require('./routes/themeRoute');
app.use('/api/theme', theme_route);

// Definir el archivo raíz para servir los archivos
const root = path.join(__dirname, '../Frontend/GJ-Platform/dist/gj-platform/browser');

// Servir los archivos estáticos
app.use(express.static(root));

// Manejar todas las rutas
app.get('*', function (req, res) {
    fs.stat(path.join(root, req.path), function (err) {
        if (err) {
            res.sendFile('index.html', { root });
        } else {
            res.sendFile(req.path, { root });
        }
    });
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

const Stage = require('./models/stageModel');
const GameJam = require('./models/gameJamEventModel');
const Submission = require('./models/submissionModel');
const Team = require('./models/teamModel');
const { sendScore } = require('./services/mailer');

async function sendEvaluations() {
    var currentStage;
    const currentDatee = new Date();
   //const currentDatee = new Date(Date.UTC(2024, 4, 31, 0, 0, 1, 0));
   const currentDate = currentDatee.toISOString().slice(0, 10);
   
    const allGameJams = await GameJam.find({});

    for (const gameJam of allGameJams) {
        for (const stage of gameJam.stages) {
            //console.log(currentDate)
            //console.log(stage.endDateEvaluation.toISOString().slice(0, 10));
            if (currentDate === stage.endDateEvaluation.toISOString().slice(0, 10)) {
                currentStage = stage;
                break;
            }
        }
    }
    if (currentStage) {
        //console.log("hoyyyy")
        const submissions = await Submission.find({ "stageId": currentStage._id });
        for (const sub of submissions) {
            const criteriaAverages = {};
            const criteriaCount = {};
            for (const evaluator of sub.evaluators) {
                Object.keys(evaluator._doc).forEach(key => {
                    if (typeof evaluator[key] === 'number') {
                        criteriaAverages[key] = (criteriaAverages[key] || 0) + (evaluator[key] || 0);
                        criteriaCount[key] = (criteriaCount[key] || 0) + 1;

                    }
                });

            }

            for (const key in criteriaAverages) {
                criteriaAverages[key] = criteriaAverages[key] / criteriaCount[key];
            }


            const score = Object.values(criteriaAverages).reduce((acc, average) => acc + average, 0) / Object.values(criteriaAverages).length;
            sub.evaluationScore = score;
            await sub.save();
            const promises = [];

            const team = await Team.findById(sub.teamId);
            for (const jammer of team.jammers) {
                const subject = 'Score Stage on GameJam Platform';

                const emailPromise = sendScore(
                    jammer.email,
                    subject,
                    score
                );
                promises.push(emailPromise);
            }

            await Promise.all(promises);
        }
    }





};

cron.schedule('0 0 * * *', () => {
    sendEvaluations();
}, {
    timezone: "America/Costa_Rica"
});
