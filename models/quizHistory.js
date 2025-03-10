const mongoose = require('mongoose');

const quizHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: Number,
    totalQuestion: Number,
    answers: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selectedAnswers: [Number],
        correct: Boolean
    }]
}, { timestamps: true });

module.exports = mongoose.model('QuizHistory', quizHistorySchema);
