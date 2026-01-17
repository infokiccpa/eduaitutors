import mongoose, { Schema, model, models } from 'mongoose';

const LeadSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    courseInterest: { type: String },
    grade: { type: String },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Enrolled'],
        default: 'New'
    },
    notes: { type: String },
    source: { type: String, default: 'Website' },
}, { timestamps: true });

const Lead = models.Lead || model('Lead', LeadSchema);
export default Lead;
