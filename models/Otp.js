const mongoose = require('mongoose')

// Otp Schema
const OtpSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        otp: { type: String, required: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
);

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

mongoose.models = {};
module.exports = mongoose.model("otp", OtpSchema)