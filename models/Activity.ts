import mongoose, { Schema, model, models } from 'mongoose';

const ActivitySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['quiz', 'lesson', 'achievement'], required: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    score: { type: String },
    time: { type: Date, default: Date.now },
}, { timestamps: true });

const Activity = models.Activity || model('Activity', ActivitySchema);

export default Activity;
