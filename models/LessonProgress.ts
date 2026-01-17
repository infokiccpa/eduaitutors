import mongoose, { Schema, model, models } from 'mongoose';

const LessonProgressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    chapterIndex: { type: Number, required: true },
    progress: { type: Number, default: 0 }, // Percentage or seconds
    watchTime: { type: Number, default: 0 }, // Total seconds watched
    isCompleted: { type: Boolean, default: false },
    lastWatched: { type: Date, default: Date.now },
}, { timestamps: true });

// Ensure one progress record per user per course per lesson
LessonProgressSchema.index({ userId: 1, courseId: 1, chapterIndex: 1 }, { unique: true });

const LessonProgress = models.LessonProgress || model('LessonProgress', LessonProgressSchema);
export default LessonProgress;
