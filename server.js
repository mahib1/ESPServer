require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

let collection; // <-- global reference to collection

// POST route
app.post('/data', async (req, res) => {
  const { temperature, moisture } = req.body;

  if (typeof temperature !== 'number' || typeof moisture !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const reading = { temperature, moisture, timestamp: new Date() };
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

// Connect to DB then start server
async function main() {
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

    // Start server *after* DB is ready
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

main();
