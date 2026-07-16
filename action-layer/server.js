import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Kafka } from 'kafkajs';
import cors from 'cors';

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
const consumer = kafka.consumer({ groupId: 'action-layer-group' });

// 3. The Main Event Loop
async function start() {
    // Ensure topic exists to prevent UNKNOWN_TOPIC_OR_PARTITION crash
    const admin = kafka.admin();
    await admin.connect();
    const topics = await admin.listTopics();
    if (!topics.includes('fraud-alerts')) {
        await admin.createTopics({
            topics: [{ topic: 'fraud-alerts' }]
        });
        console.log('✅ Created fraud-alerts topic');
    }
    await admin.disconnect();

    await consumer.connect();
    await consumer.subscribe({ topic: 'fraud-alerts', fromBeginning: false });
    console.log('📡 WebSocket Sidecar listening to Kafka: fraud-alerts...');

    // When Python drops an alert into Kafka, this triggers instantly
    await consumer.run({
        eachMessage: async ({ message }) => {
            const payload = JSON.parse(message.value.toString());
            console.log(`🚨 Alert Received for Session: ${payload.sessionId} -> ${payload.action}`);

            // Blast the alert down the WebSocket to the React frontend
            io.emit('security-action', payload);
        },
    });
}

// 4. Start the Server
server.listen(3001, () => {
    console.log('🔌 WebSocket Server live on port 3001');
    start().catch(console.error);
});