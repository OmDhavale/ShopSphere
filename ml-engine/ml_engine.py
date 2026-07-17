import json
import numpy as np
from collections import deque
from confluent_kafka import Consumer, Producer
from pyod.models.iforest import IForest

# ==============================================
# Architecture and Memory Settings
# ==============================================
MAX_MEMORY = 500
WARMUP_LIMIT = 50
memory_buffer = deque(maxlen=MAX_MEMORY)
pending_challenges = {}

# ==============================================
# Model Initialization
# ==============================================
model = IForest(contamination=0.05)

# ==============================================
# Kafka Connections
# ==============================================
consumer = Consumer({
    "bootstrap.servers": "localhost:9092",
    "group.id": "ml-anomaly-detector",
    "auto.offset.reset": "latest"
})
consumer.subscribe(["raw-clickstream-events"])

producer = Producer({"bootstrap.servers": "localhost:9092"})

def send_alert(session_id, action_type, score):
    payload = json.dumps({
        "sessionId": session_id,
        "action": action_type,
        "risk": round(score, 2)
    })
    producer.produce("fraud-alerts", key=session_id, value=payload)
    producer.flush()

print("🧠 Python ML engine is live. Listening to Kafka...")

# ==============================================
# Main Event Loop
# ==============================================
try:
    while True:
        msg = consumer.poll(1.0)
        if msg is None: continue
        if msg.error():
            print(f"⚠️ Kafka Error: {msg.error()}")
            continue

        raw_data = msg.value().decode("utf-8")
        payload = json.loads(raw_data)
        session_id = payload.get("sessionId", "Unknown")
        events = payload.get("events", [])

        velocities = [e["velocity"] for e in events if e.get("type") == "mouse_move" and "velocity" in e]
        if not velocities:
            continue
        
        avg_velocity = np.mean(velocities)
        action_count = len(events)
        current_behaviour = [avg_velocity, action_count]

        if len(memory_buffer) < WARMUP_LIMIT:
            memory_buffer.append(current_behaviour)
            print(f"[WARMUP] Learning baseline... ({len(memory_buffer)}/{WARMUP_LIMIT})")

        else:
            if len(memory_buffer) == WARMUP_LIMIT:
                x_train = np.array(memory_buffer)
                model.fit(x_train)

            x_test = np.array([current_behaviour])
            risk_score = model.predict_proba(x_test)[0][1]

            if risk_score > 0.70:
                print(f"🚨 RED ZONE    | Session: {session_id[:8]} | Score: {risk_score:.2f} -> BLOCKED")
                send_alert(session_id, 'BLOCK_USER', risk_score)
                # Data dropped

            elif risk_score > 0.40:
                print(f"🟡 YELLOW ZONE | Session: {session_id[:8]} | Score: {risk_score:.2f} -> CAPTCHA SENT")
                send_alert(session_id, 'TRIGGER_CAPTCHA', risk_score)
                # Data dropped (until they pass the CAPTCHA later)

            else:
                print(f"✅ GREEN ZONE  | Session: {session_id[:8]} | Score: {risk_score:.2f} -> ALLOWED")
                memory_buffer.append(current_behaviour)
                x_train = np.array(memory_buffer)
                model.fit(x_train)

except KeyboardInterrupt:
    print("\n🛑 Shutting down ML Engine safely...")
finally:
    consumer.close()