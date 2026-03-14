const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    technologies: {
        type: [String],
        required: true,
        default: []
    },
    imageUrl: {
        type: String,
    },
    githubUrl: {
        type: String,
    },
    liveDemoUrl: {
        type: String,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
