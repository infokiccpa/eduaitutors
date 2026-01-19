import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false,
    },
    package: {
        type: String,
        default: null,
    },
    price: {
        type: String,
        default: null,
    },
    grade: {
        type: String,
        default: null,
    },
    board: {
        type: String,
        default: null,
    },
    subjects: {
        type: [String],
        default: [],
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'superadmin', 'mentor', 'parent'],
        default: 'student',
    },
    phone: {
        type: String,
        default: null,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

// Force update schema for development
if (models.User) {
    delete mongoose.models.User;
}
const User = model('User', UserSchema);

export default User;
