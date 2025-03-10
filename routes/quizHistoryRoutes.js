const express = require('express');
const router = express.Router();
const QuizHistoryController = require('../controllers/quizHistoryController');

router.post('/', QuizHistoryController.submitQuiz);
router.get('/results/:userId', QuizHistoryController.getUserQuizHistory);

module.exports = router;
