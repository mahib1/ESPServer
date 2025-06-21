require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

let collection;

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

app.get('/fetch/:count', async (req, res) => {
  const count = parseInt(req.params.count, 10);

  if (isNaN(count) || count <= 0) {
    return res.status(400).json({ error: 'Invalid count parameter' });
  }

  try {
    const latestReadings = await collection
      .find({})
      .sort({ timestamp: -1 })      
      .limit(count)
      .toArray();

    res.status(200).json(latestReadings);
  } catch (err) {
    console.error('Failed to fetch data:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/', (req, res) => {
  res.send('Sensor API is running');
});

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
    console.log('Connected to MongoDB');

    const db = client.db('sensordata');
    collection =  db.collection('sensorreadings');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

main();
