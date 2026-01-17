import mongoose, { Schema, model, models } from 'mongoose';

const ChapterSchema = new Schema({
    title: { type: String, required: true },
    time: { type: String, required: true },
});

const ResourceSchema = new Schema({
    name: { type: String, required: true },
    size: { type: String, required: true },
    type: { type: String, required: true },
});

const QuestionSchema = new Schema({
    type: { type: String, enum: ['mcq', 'fill'], required: true },
    question: { type: String, required: true },
    options: [String],
    answer: { type: String, required: true },
});

const CourseSchema = new Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    packageName: {
        type: String,
        required: true,
        enum: ['Foundation Builder', 'Mastery Accelerator', 'Excellence Pro', 'JEE Mastery', 'NEET Prep']
    },
    duration: { type: String, required: true },
    lessons: { type: Number, required: true },
    image: { type: String, required: true },
    instructor: { type: String, required: true },
    description: { type: String, required: true },
    elite: { type: Boolean, default: false },
    learningObjectives: [String],
    chapters: [ChapterSchema],
    resources: [ResourceSchema],
    questions: [QuestionSchema],
}, { timestamps: true });

const Course = models.Course || model('Course', CourseSchema);

export default Course;
