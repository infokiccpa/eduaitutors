import mongoose, { Schema, model, models } from 'mongoose';

const LiveJoinLogSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    grade: { type: String },
    subject: { type: String },
    device: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    joinTime: { type: Date, default: Date.now },
}, { timestamps: true });

// Prevent multiple logs for the same user in the same class session (within 5 minutes)
LiveJoinLogSchema.index({ email: 1, subject: 1, grade: 1, createdAt: -1 });

const LiveJoinLog = models.LiveJoinLog || model('LiveJoinLog', LiveJoinLogSchema);
export default LiveJoinLog;
