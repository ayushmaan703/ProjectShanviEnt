import mongoose, { Schema } from 'mongoose';

const usedTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: process.env.ACCESS_TOKEN_EXPIRY,
    },
});

export const UsedToken = mongoose.model('UsedToken', usedTokenSchema);