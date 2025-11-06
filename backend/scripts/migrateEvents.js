const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');
const connectDb = require('../config/connectionDb');

dotenv.config();

const migrateEvents = async () => {
    try {
        await connectDb();
        console.log('Connected to database');

        // Get all events
        const events = await Event.find({});
        console.log(`Found ${events.length} events to migrate`);

        let updated = 0;
        let skipped = 0;

        for (const event of events) {
            const updateFields = {};
            let needsUpdate = false;

            // Migrate old imageUrl to bannerImage if bannerImage doesn't exist
            if (!event.bannerImage && event.imageUrl) {
                updateFields.bannerImage = event.imageUrl;
                needsUpdate = true;
                console.log(`Migrating imageUrl to bannerImage for event: ${event.title}`);
            }

            // Ensure activityIncludes field exists (set to null if missing)
            if (event.activityIncludes === undefined) {
                updateFields.activityIncludes = null;
                needsUpdate = true;
            }

            // Remove old fields if they exist (type, isPastEvent)
            if (event.type !== undefined || event.isPastEvent !== undefined) {
                updateFields.$unset = {};
                if (event.type !== undefined) updateFields.$unset.type = '';
                if (event.isPastEvent !== undefined) updateFields.$unset.isPastEvent = '';
                needsUpdate = true;
                console.log(`Removing old fields from event: ${event.title}`);
            }

            if (needsUpdate) {
                await Event.findByIdAndUpdate(event._id, updateFields);
                updated++;
            } else {
                skipped++;
            }
        }

        console.log('\nMigration completed!');
        console.log(`Updated: ${updated} events`);
        console.log(`Skipped: ${skipped} events (already up to date)`);
        
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
};

migrateEvents();

