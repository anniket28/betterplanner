const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    username: String,
    timezone: {
        type: String,
        default: "UTC"
    },
    lastReminderSent: { type: Date, default: null },
    createdAt: Date,
});

mongoose.models = {};
module.exports = mongoose.model("user", UserSchema)