import mongoose, { Schema, model, models } from 'mongoose';

const QuizResultSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    answers: [{
        questionIndex: Number,
        selectedOption: String,
        isCorrect: Boolean
    }],
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const QuizResult = models.QuizResult || model('QuizResult', QuizResultSchema);

export default QuizResult;
