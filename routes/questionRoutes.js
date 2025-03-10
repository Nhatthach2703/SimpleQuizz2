const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { verifyToken, verifyAuthor } = require("../authentication/auth");

router.get('/', questionController.getQuestions);
router.get('/create',  questionController.createQuestion);
router.post('/create',verifyToken, questionController.createQuestion);
router.get('/:id', questionController.getQuestionDetails);
router.get('/:id/edit', questionController.editQuestion);
router.put('/:id/edit', verifyToken, verifyAuthor, questionController.editQuestion);
router.delete('/:id', verifyToken, verifyAuthor, questionController.deleteQuestion);

module.exports = router;