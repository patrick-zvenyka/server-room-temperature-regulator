# Real-Time Data Ingestion Methods

This document outlines the most applicable ways for the NetOne Server Room Temperature Regulator system to ingest real-time telemetry data (temperature, humidity) from physical or simulated IoT sensors, along with their pros and cons.

## 1. Direct HTTP REST Webhooks (Current Approach)

The system currently exposes a REST API endpoint (`POST /api/monitoring/sensor-logs/`) that sensors can hit directly to submit telemetry data.

**How it works:**
1. Each IoT edge device (e.g., Raspberry Pi, ESP32) collects sensor readings.
2. The device packages the payload into JSON.
3. The device sends an HTTP POST request to the Django backend.

**Pros:**
- Simple to implement; no additional infrastructure required.
- Uses standard HTTP protocols natively supported by Django REST Framework.
- Synchronous processing ensures data is written to the database immediately and alerts are generated in real-time.

**Cons:**
- High latency overhead for each request due to TCP/HTTP handshakes.
- Does not scale efficiently if thousands of sensors report simultaneously every second.
- Devices must handle retry logic if the server is temporarily unreachable.

## 2. MQTT (Message Queuing Telemetry Transport)

MQTT is the industry standard for IoT telemetry. It uses a Publisher/Subscriber model over a lightweight TCP connection.

**How it works:**
1. A Message Broker (like Eclipse Mosquitto or RabbitMQ) is deployed alongside the Django application.
2. Edge devices *publish* telemetry data to specific topics (e.g., `telemetry/rack-1`).
3. A backend worker (e.g., a Celery worker or a dedicated Python script) *subscribes* to these topics.
4. When a message arrives, the worker parses it and saves it to the database (`ServerRackSensorLog`), triggering any necessary alerts.

**Pros:**
- Extremely lightweight and low bandwidth, ideal for constrained IoT devices.
- Built-in Quality of Service (QoS) levels guarantee message delivery even during brief network interruptions.
- Highly scalable; the broker easily handles thousands of concurrent connections.

**Cons:**
- Requires additional infrastructure setup (the MQTT broker).
- Requires an always-on backend subscriber script to bridge the gap between MQTT and the Django database.

## 3. WebSockets

WebSockets provide a persistent, full-duplex communication channel over a single TCP connection.

**How it works:**
1. Django Channels is integrated into the backend stack, replacing WSGI with ASGI.
2. Sensors establish a WebSocket connection with the server and stream data continuously without the overhead of HTTP headers.
3. The backend processes incoming frames and saves them to the database.
4. Concurrently, the frontend dashboard connects via WebSockets to receive instant, push-based updates of the latest temperatures without needing to poll the API.

**Pros:**
- Lowest latency possible; truly real-time.
- Enables bi-directional communication (e.g., sending a "reset" command from the dashboard down to the sensor).
- The same infrastructure can be used to push live updates to the React frontend.

**Cons:**
- More complex to set up; requires moving Django to ASGI and configuring a backing store like Redis for channel layers.
- Maintaining persistent connections consumes server memory and requires careful tuning.

## Recommendation for NetOne Server Room

For the current scale (monitoring a single or small cluster of server rooms):
1. **Short Term**: Continue using **HTTP REST Webhooks**. It is robust enough for polling frequencies of 10-60 seconds.
2. **Medium Term (Frontend Push)**: Introduce **WebSockets** (via Django Channels) primarily to push real-time updates from the Django backend to the React dashboard, avoiding heavy API polling.
3. **Long Term (IoT Scaling)**: If the system expands nationwide to hundreds of base stations, adopt **MQTT** to handle the massive influx of telemetry data securely and reliably, using a robust broker like RabbitMQ.
