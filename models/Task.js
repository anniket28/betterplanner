const mongoose = require('mongoose')

// Task Schema
const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        category: {
            type: String
        },
        priority: {
            type: String
        },
        type: {
            type: String
        },
        day: {
            type: String
        },
        month: {
            type: String
        },
        dayOfMonth: {
            type: Number
        },
        dueDate: {
            type: Date
        },
        isRepeatable: {
            type: Boolean,
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        completedAt: {
            type: Date
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        date: {
            type: String,
        },
        createdBy: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

mongoose.models = {};
module.exports = mongoose.model("task", TaskSchema)