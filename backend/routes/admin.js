const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const {
    login,
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById
} = require('../controller/adminController');

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', login);

// @route   POST /api/admin/upload
// @desc    Upload banner image
// @access  Private
router.post('/upload', auth, (req, res, next) => {
    upload.single('bannerImage')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ msg: 'File too large. Maximum size is 5MB.' });
                }
                return res.status(400).json({ msg: err.message });
            }
            return res.status(400).json({ msg: err.message || 'Error uploading file' });
        }
        next();
    });
}, (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Return the file URL
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({
            success: true,
            url: fileUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ msg: 'Error uploading file' });
    }
});

// All routes below require authentication
router.use(auth);

// @route   GET /api/admin/events
// @desc    Get all events
// @access  Private
router.get('/events', getAllEvents);

// @route   POST /api/admin/events
// @desc    Create new event
// @access  Private
router.post('/events', createEvent);

// @route   GET /api/admin/events/:id
// @desc    Get single event
// @access  Private
router.get('/events/:id', getEventById);

// @route   PUT /api/admin/events/:id
// @desc    Update event
// @access  Private
router.put('/events/:id', updateEvent);

// @route   DELETE /api/admin/events/:id
// @desc    Delete event
// @access  Private
router.delete('/events/:id', deleteEvent);

module.exports = router;

