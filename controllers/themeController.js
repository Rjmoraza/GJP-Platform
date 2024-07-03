  const jwt = require('jsonwebtoken');
  const mongoose = require('mongoose');
  const Theme = require("../models/themeModel");
  const Submission = require("../models/submissionModel");
  const User = require("../models/userModel");
  const GameJam = require('../models/gameJamEventModel');

  const createTheme = async (req, res) => {
    try {
      const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
      let creatorUser = await User.findById(userId);

      if (!Theme.findOne({ titleEN: req.body.titleEN })) {
        return res.status(409).json({ success: false, error: 'Theme already exists' });
      }

      const { manualSP, manualEN, manualPT } = req.files;
      const manualSPBuffer = manualSP[0].buffer;
      const manualENBuffer = manualEN[0].buffer;
      const manualPTBuffer = manualPT[0].buffer;
  
      const theme = new Theme({
        manualPT: manualPTBuffer,
        manualSP: manualSPBuffer,
        manualEN: manualENBuffer,
        descriptionSP: req.body.descriptionSP,
        descriptionPT: req.body.descriptionPT,
        descriptionEN: req.body.descriptionEN,
        titleSP: req.body.titleSP,
        titleEN: req.body.titleEN,
        titlePT: req.body.titlePT,
        creatorUser: {
          userId: creatorUser._id,
          name: creatorUser.name,
          email: creatorUser.email,
        },
        creationDate: new Date(),
      });
  
      await theme.save();
  
      res.status(200).json({ success: true, msg: 'Theme created successfully', theme: theme });
    } catch (error) {
      return res.status(400).json({ success: false, msg:error.message});
    }
  };  

  const getTheme = async (req, res) => {
    try {
      const temaId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(temaId)) {
        return res.status(404).json({ success: false, error: 'Tema no encontrado' });
      }
      const tema = await Theme.findById(temaId);

      if (!tema) {
        return res.status(404).json({ success: false, error: 'Tema no encontrado' });
      }
      return res.status(200).json({ success: true, msg: 'Tema encontrado correctamente', theme: tema });
    } catch (error) {
      return res.status(400).json({ success: false, msg:error.message });
    }
  };

  const getThemes = async (req, res) => {
    try {
      const temas = await Theme.find({});
      return res.status(200).json({ success: true, data: temas });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };

  const updateTheme = async (req, res) => {
    try {
        const userId = req.cookies.token ? jwt.verify(req.cookies.token, 'MY_JWT_SECRET').userId : null;
        const themeId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(themeId)) {
            return res.status(404).json({ success: false, error: 'Theme not found' });
        }

        const theme = await Theme.findById(themeId);

        if (!theme) {
            return res.status(404).json({ success: false, error: 'Theme not found' });
        }

        const { manualSP, manualEN, manualPT } = req.files;
        const manualSPBuffer = manualSP ? manualSP[0].buffer : theme.manualSP;
        const manualENBuffer = manualEN ? manualEN[0].buffer : theme.manualEN;
        const manualPTBuffer = manualPT ? manualPT[0].buffer : theme.manualPT;

        const updatedThemeData = {
            manualSP: manualSPBuffer,
            manualEN: manualENBuffer,
            manualPT: manualPTBuffer,
            descriptionSP: req.body.descriptionSP,
            descriptionEN: req.body.descriptionEN,
            descriptionPT: req.body.descriptionPT,
            titleSP: req.body.titleSP,
            titleEN: req.body.titleEN,
            titlePT: req.body.titlePT,
            lastUpdateUser: {
                userId: userId,
                name: 'Updated User Name', // Puedes obtener el nombre del usuario de la base de datos si lo necesitas
                email: 'updated@example.com' // Puedes obtener el correo electrónico del usuario de la base de datos si lo necesitas
            }
        };

        const updatedTheme = await Theme.findByIdAndUpdate(themeId, updatedThemeData, { new: true });

        return res.status(200).json({ success: true, msg: 'Successfully updated', theme: updatedTheme });
    } catch (error) {
        return res.status(400).json({ success: false, msg: error.message });
    }
};


  const deleteTheme = async (req, res) => {
    try {
      const id = req.params.id;
      
      const deletedTheme = await Theme.findOneAndDelete({ _id: id });

      if (deletedTheme) {
          res.status(200).send({ success: true, msg: 'Theme deleted', data: deletedTheme });
      } else {
          res.status(404).json({ success: false, error: 'Theme not found' });
      }
  } catch (error) {
      res.status(400).send({ success: false, msg: error.message });
  }
  };

  
  const getGamesPerTheme = async (req, res) => {
    const themeId = req.params.id;
      try {
          const submissions = await Submission.find({ theme: themeId })
              .populate('team')
              .populate('category')
              .populate('stage')
              .populate('game')
              .populate('theme')
          console.log(submissions)
          return res.status(200).json({ success: true, data: submissions });
      } catch (error) {
          res.status(400).json({ error: 'Error interno del servidor' });
      }
  }

  const getPDF = async (req, res) =>{
    try {
        const themeId = req.params.id;
        const language = req.params.language;
        const theme = await Theme.findById(themeId);

        if (!theme) {
            return res.status(404).send('Tema no encontrada');
        }

        let pdfData;
        let fileName;

        // Seleccionar el PDF según el idioma proporcionado
        switch (language) {
          case 'SP':
              pdfData = theme.manualSP;
              fileName = 'manualSP.pdf';
              break;
          case 'EN':
              pdfData = theme.manualEN;
              fileName = 'manualEN.pdf';
              break;
          case 'PT':
              pdfData = theme.manualPT;
              fileName = 'manualPT.pdf';
              break;
          default:
              return res.status(400).send('Idioma no soportado');
      }

      if (!pdfData) {
          return res.status(404).send('Manual no encontrado para el idioma especificado');
      }
        // Opción 1: Enviar los datos binarios directamente al cliente
        res.contentType('application/pdf').send(pdfData);

        // Opción 2: Crear un enlace de descarga (comentado)
        // fs.writeFileSync(fileName, pdfData); // Guarda el PDF localmente
        // res.download(fileName); // Descarga el PDF al cliente

    } catch (error) {
        console.error('Error al obtener el PDF:', error);
        res.status(500).send('Error interno del servidor');
    }
    
};

  module.exports = {
    createTheme,
    deleteTheme,
    updateTheme,
    getTheme,
    getThemes,
    getGamesPerTheme,
    getPDF
  };
