// app/api/telemetry/route.js
import { NextResponse } from 'next/server';
import { getKafkaProducer } from '@/lib/kafka';

export async function POST(request) {
    try {
        const body = await request.json();
        const { sessionId, userId, events } = body;

        if (!sessionId || !events) {
            return NextResponse.json({ error: 'Invalid schema' }, { status: 400 });
        }

        // Grab the active Kafka connection
        const producer = await getKafkaProducer();

        // Shoot the data to Kafka
        await producer.send({
            topic: 'raw-clickstream-events',
            messages: [
                {
                    key: sessionId,
                    value: JSON.stringify({ sessionId, userId, events })
                }
            ]
        });

        // Return a 202 instantly so the browser doesn't hang
        return NextResponse.json({ status: 'Queued' }, { status: 202 });

    } catch (error) {
        console.error('Ingestion Error:', error);
        return NextResponse.json({ error: 'Internal pipeline choke' }, { status: 500 });
    }
}