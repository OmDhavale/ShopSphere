import mongoose from 'mongoose';

const telemetrySchema = new mongoose.Schema({
    sessionId: String,
    userId: String,
    pageUrl: String,
    screenWidth: Number,
    screenHeight: Number,
    events: [
        {
            type: { type: String }, // e.g. 'mouse_move', 'click', 'scroll'
            x: Number,
            y: Number,
            velocity: Number,
            targetTag: String,
            depth: Number,
            timestamp: Number
        }
    ],
    // TTL index: MongoDB will auto-delete documents older than 30 days
    createdAt: { type: Date, default: Date.now, expires: '30d' }
});

const Telemetry = mongoose.models.Telemetry || mongoose.model('Telemetry', telemetrySchema);
export default Telemetry;
