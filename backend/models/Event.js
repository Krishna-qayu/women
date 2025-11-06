const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    bannerImage: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    time: {
        type: String, 
        required: false
    },
    entryFees: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    activityIncludes: {
        type: String,
        required: false
    }
}, { timestamps: true }); 
module.exports = mongoose.model('Event', EventSchema);