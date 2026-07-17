import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Kafka } from 'kafkajs';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// 1. Setup the Web Server & Socket.io
const app = express();
app.use(cors());
const server = http.createServer(app);

// Enable CORS so your Next.js app on port 3000 can connect to this socket
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// 2. Setup Kafka Connection
const kafka = new Kafka({
    clientId: 'websocket-sidecar',
    brokers: ['localhost:9092']
});
const consumer1 = kafka.consumer({ groupId: 'fraud-alerts-detector' });
const consumer2 = kafka.consumer({ groupId: 'raw-clickstream-grabber' });

// Setup Mongoose Connection
import mongoose from 'mongoose';
import Telemetry from './models/Telemetry.js';

const MONGO_URI = process.env.MONGODB_URI
mongoose.connect(MONGO_URI, {
}).then(() => console.log('📦 Connected to MongoDB from Action Layer'))
    .catch(err => console.error('MongoDB connection error:', err));



// 3. The Main Event Loop
async function start() {
    const admin = kafka.admin();
    await admin.connect();
    const topics = await admin.listTopics();
    const requiredTopics = ['fraud-alerts', 'raw-clickstream-events'];
    const topicsToCreate = requiredTopics.filter(t => !topics.includes(t));

    if (topicsToCreate.length > 0) {
        await admin.createTopics({
            topics: topicsToCreate.map(t => ({ topic: t }))
        });
        console.log(`✅ Created topics: ${topicsToCreate.join(', ')}`);
    }
    await admin.disconnect();
    // Ensure topic exists to prevent UNKNOWN_TOPIC_OR_PARTITION crash

    await consumer1.connect();
    await consumer1.subscribe({ topic: 'fraud-alerts', fromBeginning: false });
    await consumer2.connect();
    await consumer2.subscribe({ topic: 'raw-clickstream-events', fromBeginning: false });
    console.log('📡 WebSocket Sidecar listening to Kafka: fraud-alerts and raw-clickstream-events...');

    // When Python drops an alert into Kafka, this triggers instantly
    await consumer1.run({
        eachMessage: ({ message }) => {
            const payload = JSON.parse(message.value.toString());

            console.log(`🚨 Alert Received for Session: ${payload.sessionId} -> ${payload.action}`);

            // Blast the alert down the WebSocket to the React frontend
            io.emit('security-action', payload);
        },
    });

    await consumer2.run({
        eachMessage: async ({ message }) => {
            const payload = JSON.parse(message.value.toString());

            // Save to MongoDB
            try {
                await Telemetry.create({
                    sessionId: payload.sessionId,
                    userId: payload.userId,
                    pageUrl: payload.pageUrl || 'unknown',
                    screenWidth: payload.screenWidth || 1920,
                    screenHeight: payload.screenHeight || 1080,
                    events: payload.events || []
                });
            } catch (err) {
                console.error('Failed to save telemetry data to MongoDB', err);
            }
        },
    });
}

// 4. Start the Server
server.listen(3001, () => {
    console.log('🔌 WebSocket Server live on port 3001');
    start().catch(console.error);
});