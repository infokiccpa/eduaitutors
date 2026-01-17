import mongoose, { Schema, model, models } from 'mongoose';

const ScheduleSchema = new Schema({
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    subject: { type: String, required: true },
    startTime: { type: Date, required: true },
    duration: { type: String, required: true },
    meetingLink: { type: String, required: true },
    description: { type: String },
    packageName: { type: String }, // Optional: restrict to specific plan
}, { timestamps: true });

const Schedule = models.Schedule || model('Schedule', ScheduleSchema);

export default Schedule;
