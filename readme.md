---
```markdown
# 🌡️ Sensor API Server

A lightweight Node.js server built with **Express** and **MongoDB**, designed to collect and store **temperature** and **moisture** sensor data sent from client devices like ESP32.

---

## 🚀 Features

- Accepts JSON POST requests at `/data`
- Stores sensor data in MongoDB Atlas (or local MongoDB)
- `.env`-based configuration
- Lightweight, no ORM (uses native MongoDB driver)

---

## 🧱 Tech Stack

- Node.js
- Express.js
- MongoDB (via native driver)
- dotenv (for secure config)
- body-parser

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/sensor-api.git
cd sensor-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/sensordata?retryWrites=true&w=majority
PORT=3000
```

> Replace `<user>` and `<password>` with your MongoDB Atlas credentials.

### 4. Run the Server

```bash
node server.js
```

If successful, you’ll see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

---

## 📡 API Endpoints

### `POST /data`

Submit sensor readings.

#### Request Body:

```json
{
  "temperature": 25.4,
  "moisture": 70
}
```

#### Example `curl`:

```bash
curl -X POST http://localhost:3000/data \
  -H "Content-Type: application/json" \
  -d '{"temperature": 25.4, "moisture": 70}'
```

#### Response:

```json
{
  "message": "Data saved successfully",
  "id": "6658f987e2ba7a14b8123abc"
}
```

---

### `GET /`

Health check endpoint.

```bash
curl http://localhost:3000/
# Output: "Sensor API is running"
```

---

## 📂 MongoDB Schema

Each document looks like:

```json
{
  "_id": "6658f987e2ba7a14b8123abc",
  "temperature": 25.4,
  "moisture": 70,
  "timestamp": "2025-06-21T12:04:23.472Z"
}
```

---

## 📋 Todo

- [ ] Add `GET /data` endpoint to retrieve stored readings
- [ ] Add basic authentication or token verification
- [ ] Add rate limiting to prevent spam

---

## 🧠 License

MIT – Feel free to use and modify.
```

---

Let me know if you want:
- A **GET /data** endpoint
- Instructions for **deployment on Render/Vercel**
- Auto-restart using **PM2** or **systemd** on a Pi

Want me to also generate a `package.json` for this project?
