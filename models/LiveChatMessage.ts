import mongoose, { Schema, model, models } from 'mongoose';

const LiveChatMessageSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    grade: { type: String },
    subject: { type: String },
    isAdmin: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

// Index for fast fetching of messages for a specific class
LiveChatMessageSchema.index({ subject: 1, grade: 1, createdAt: 1 });

const LiveChatMessage = models.LiveChatMessage || model('LiveChatMessage', LiveChatMessageSchema);
export default LiveChatMessage;
