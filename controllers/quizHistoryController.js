const QuizHistory = require('../models/quizHistory');
const Quiz = require('../models/quiz');
const Question = require('../models/question');

exports.submitQuiz = async (req, res) => {
    try {
        const { userId, quizId, answers } = req.body;

        const quiz = await Quiz.findById(quizId).populate('questions');
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let score = 0;
        let totalQuestion = quiz.questions.length;
        let resultDetails = [];

        for (let i = 0; i < totalQuestion; i++) {
            const question = quiz.questions[i];
            const userAnswer = answers[i]; 
            const isCorrect = question.correctAnswerIndex.every(idx => userAnswer.includes(idx)) &&
                              userAnswer.length === question.correctAnswerIndex.length;

            resultDetails.push({
                questionId: question._id,
                selectedAnswers: userAnswer,
                correct: isCorrect
            });

            if (isCorrect) score++;
        }

        const newQuizHistory = new QuizHistory({
            userId,
            quizId,
            score,
            totalQuestion,
            answers: resultDetails
        });

        await newQuizHistory.save();
        res.status(201).json({ message: "Quiz submitted successfully!", result: newQuizHistory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserQuizHistory = async (req, res) => {
    try {
        const results = await QuizHistory.find({ userId: req.params.userId }).populate('quizId');
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
