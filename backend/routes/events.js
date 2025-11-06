const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 }); // Sort by date ascending
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') { // Handle invalid ObjectId format
            return res.status(404).json({ msg: 'Event not found' });
        }
        res.status(500).send('Server Error');
    }
});


// @route   POST api/events
// @desc    Create an event
// @access  Private (you'd add authentication middleware here later)
router.post('/', async (req, res) => {
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
});

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private
router.put('/:id', async (req, res) => {
    const { title, bannerImage, date, time, entryFees, description, location, activityIncludes } = req.body;

    // Build event object
    const eventFields = {};
    if (title) eventFields.title = title;
    if (bannerImage !== undefined) eventFields.bannerImage = bannerImage;
    if (date !== undefined) eventFields.date = date || null;
    if (time !== undefined) eventFields.time = time || null;
    if (entryFees !== undefined) eventFields.entryFees = entryFees || null;
    if (description) eventFields.description = description;
    if (location !== undefined) eventFields.location = location || null;
    if (activityIncludes !== undefined) eventFields.activityIncludes = activityIncludes || null;

    try {
        let event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ msg: 'Event not found' });

        event = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: eventFields },
            { new: true } // Return the updated document
        );

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ msg: 'Event not found' });

        await Event.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;