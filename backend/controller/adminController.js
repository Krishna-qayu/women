const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key-change-in-production', {
        expiresIn: '30d'
    });
};

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if admin exists
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(admin._id);

        res.json({
            token,
            admin: {
                id: admin._id,
                username: admin.username
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/admin/events
// @desc    Get all events (admin view)
// @access  Private
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST /api/admin/events
// @desc    Create new event
// @access  Private
const createEvent = async (req, res) => {
    const { title, bannerImage, date, time, entryFees, description, location, activityIncludes } = req.body;

    try {
        const newEvent = new Event({
            title,
            bannerImage,
            date: date || null,
            time: time || null,
            entryFees: entryFees || null,
            description,
            location: location || null,
            activityIncludes: activityIncludes || null
        });

        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/admin/events/:id
// @desc    Update event
// @access  Private
const updateEvent = async (req, res) => {
    const { title, bannerImage, date, time, entryFees, description, location, activityIncludes } = req.body;

    try {
        let event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        const updateData = {
            title,
            description
        };

        // Handle optional fields - convert empty strings to null
        if (bannerImage !== undefined) updateData.bannerImage = bannerImage || null;
        if (date !== undefined) updateData.date = date || null;
        if (time !== undefined) updateData.time = time || null;
        if (entryFees !== undefined) updateData.entryFees = entryFees || null;
        if (location !== undefined) updateData.location = location || null;
        if (activityIncludes !== undefined) updateData.activityIncludes = activityIncludes || null;

        event = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/admin/events/:id
// @desc    Delete event
// @access  Private
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        await Event.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Event deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/admin/events/:id
// @desc    Get single event
// @access  Private
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    login,
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById
};

