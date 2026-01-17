import mongoose, { Schema, model, models } from 'mongoose';

const QuizQuestionSchema = new Schema({
    question: { type: String, required: true },
    options: [String],
    answer: { type: String, required: true },
});

const QuizSchema = new Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    questionsCount: { type: Number, required: true },
    duration: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    questions: [QuizQuestionSchema],
}, { timestamps: true });

const Quiz = models.Quiz || model('Quiz', QuizSchema);

export default Quiz;
