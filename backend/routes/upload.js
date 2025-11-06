const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const path = require('path');

// @route   POST /api/admin/upload
// @desc    Upload banner image
// @access  Private
router.post('/', auth, (req, res, next) => {
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

module.exports = router;

