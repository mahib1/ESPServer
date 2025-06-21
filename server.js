const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

let collection; // reference to the MongoDB collection

// Connect to MongoDB Atlas
async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('sensordata');
    collection = db.collection('sensorreadings');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

// POST endpoint to receive sensor data
app.post('/data', async (req, res) => {
  const { temperature, moisture } = req.body;

  if (typeof temperature !== 'number' || typeof moisture !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const reading = {
      temperature,
      moisture,
      timestamp: new Date()
    };

    const result = await collection.insertOne(reading);
    res.status(201).json({ message: 'Data saved successfully', id: result.insertedId });
  } catch (err) {
    console.error('Failed to save data:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Sensor API is running');
});

// Start server only after DB connects
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

