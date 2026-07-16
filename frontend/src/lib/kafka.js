// lib/kafka.js
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'nextjs-clickstream-gateway',
    brokers: ['localhost:9092']
});

// 1. Check if a producer already exists on the global object
// If it doesn't, create a new one.
const producer = global.kafkaProducer || kafka.producer();

// 2. Track connection state so we don't reconnect if already connected
let isConnected = global.kafkaConnected || false;

// 3. Save it globally in development mode to survive Next.js Fast Refresh
if (process.env.NODE_ENV !== 'production') {
    global.kafkaProducer = producer;
}

export const getKafkaProducer = async () => {
    if (!isConnected) {
        try {
            await producer.connect();
            isConnected = true;

            if (process.env.NODE_ENV !== 'production') {
                global.kafkaConnected = true;
            }

            console.log('⚡ Kafka Producer Connected Successfully.');
        } catch (error) {
            console.error('Failed to connect to Kafka:', error);
            throw error;
        }
    }
    return producer;
};