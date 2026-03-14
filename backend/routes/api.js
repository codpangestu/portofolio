const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Experience = require('../models/Experience');

// Simple Password Middleware
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === `Bearer ${process.env.ADMIN_PASSWORD}`) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// --- PROJECTS ENDPOINTS ---

// GET /api/projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST /api/projects (Protected)
router.post('/projects', requireAuth, async (req, res) => {
    try {
        const newProject = await Project.create(req.body);
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ error: 'Bad Request' });
    }
});

// PUT /api/projects/:id (Protected)
router.put('/projects/:id', requireAuth, async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Mengembalikan dokumen yang sudah diperbarui
        );
        if (!updatedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(updatedProject);
    } catch (err) {
        res.status(400).json({ error: 'Bad Request' });
    }
});

// DELETE /api/projects/:id (Protected)
router.delete('/projects/:id', requireAuth, async (req, res) => {
     try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({ success: true, message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- EXPERIENCES ENDPOINTS ---

// GET /api/experiences
router.get('/experiences', async (req, res) => {
     try {
        const experiences = await Experience.find().sort({ createdAt: -1 });
        res.json(experiences);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST /api/experiences (Protected)
router.post('/experiences', requireAuth, async (req, res) => {
    try {
        const newExperience = await Experience.create(req.body);
        res.status(201).json(newExperience);
    } catch (err) {
        res.status(400).json({ error: 'Bad Request' });
    }
});

// PUT /api/experiences/:id (Protected)
router.put('/experiences/:id', requireAuth, async (req, res) => {
     try {
        const updatedExperience = await Experience.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedExperience) {
            return res.status(404).json({ error: 'Experience not found' });
        }
        res.json(updatedExperience);
    } catch (err) {
        res.status(400).json({ error: 'Bad Request' });
    }
});

// DELETE /api/experiences/:id (Protected)
router.delete('/experiences/:id', requireAuth, async (req, res) => {
      try {
        const deletedExp = await Experience.findByIdAndDelete(req.params.id);
        if (!deletedExp) {
            return res.status(404).json({ error: 'Experience not found' });
        }
        res.json({ success: true, message: 'Experience deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST /api/contact
router.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    console.log(`Contact Form Submission:
    Name: ${name}
    Email: ${email}
    Message: ${message}`);

    // Simulate saving to database or sending an email
    res.status(200).json({ success: true, message: 'Message received successfully!' });
});

module.exports = router;
