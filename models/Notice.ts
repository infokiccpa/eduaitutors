import mongoose, { Schema, model, models } from 'mongoose';

const NoticeSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Notice = models.Notice || model('Notice', NoticeSchema);
export default Notice;
