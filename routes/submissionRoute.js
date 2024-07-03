const express = require('express');
const submission_route = express();

const bodyParser = require('body-parser');
submission_route.use(bodyParser.json());
submission_route.use(bodyParser.urlencoded({ extended: true })); 
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const submissionController = require('../controllers/submissionController');

submission_route.post('/create-submission', upload.none(), submissionController.createSubmission);
submission_route.put('/update-submission/:id', upload.none(), submissionController.updateSubmission);
submission_route.get('/get-current-submission/:teamId/:stageId', submissionController.getCurrentTeamSubmission);
submission_route.get('/get-submission/:id', submissionController.getSubmission);
submission_route.get('/get-submission-name/:name', submissionController.getSubmissionName);
submission_route.get('/get-submissions', submissionController.getSubmissions);
submission_route.get('/get-submissions-site/:id', submissionController.getSubmissionsSite);
submission_route.get('/get-submissions-site-name/:name', submissionController.getSubmissionsSiteName);
submission_route.get('/get-new-evaluation', submissionController.setEvaluatorToSubmission);
submission_route.delete('/delete-submission/:id', submissionController.deleteSubmission);

submission_route.post('/give-rating', upload.none(), submissionController.giveRating);
submission_route.get('/get-rating/:submissionId', submissionController.getRating);
submission_route.get('/get-submissions-evaluator/:id', submissionController.getSubmissionsEvaluator);
submission_route.get('/get-ratings-evaluator/:id', submissionController.getRatingsEvaluator);

module.exports = submission_route;