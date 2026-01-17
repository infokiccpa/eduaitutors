import mongoose, { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Usually parent
    studentId: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to which student the note is about
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Message = models.Message || model('Message', MessageSchema);
export default Message;
