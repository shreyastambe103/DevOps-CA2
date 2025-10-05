const express = require('express');
const app = express();
const port = process.env.PORT || 5500;

const axios = require('axios');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient('mongodb://10.163.218.24:27017/flexibook');

const dbName = 'BookInventory';
const collectionName = 'books';

// ⚡ Import Prometheus client
const clientProm = require('prom-client');
const register = new clientProm.Registry();

// Collect default Node.js metrics (CPU, memory, uptime, etc.)
clientProm.collectDefaultMetrics({ register });

// Histogram to track request duration (in seconds)
const httpRequestDurationSeconds = new clientProm.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5] // buckets for latency
});
register.registerMetric(httpRequestDurationSeconds);

// Counter to track total HTTP errors
const httpErrorCounter = new clientProm.Counter({
  name: 'http_request_errors_total',
  help: 'Total number of HTTP errors',
  labelNames: ['method', 'route', 'status_code']
});
register.registerMetric(httpErrorCounter);

// ⚡ Middleware for request metrics
app.use((req, res, next) => {
  const end = httpRequestDurationSeconds.startTimer();
  res.on('finish', () => {
    end({
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode,
      method: req.method
    });

    // Increment error counter if response status is 4xx or 5xx
    if (res.statusCode >= 400) {
      httpErrorCounter.inc({
        route: req.route ? req.route.path : req.path,
        status_code: res.statusCode,
        method: req.method
      });
    }
  });
  next();
});

app.use(cors());
app.use(express.json());

// ⚡ Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route to simulate error (for testing error metrics)
app.get('/error', (req, res) => {
  res.status(500).send('Simulated server error');
});

// ---------------- MongoDB Connection ----------------
async function connect() {
  try {
    await client.connect();
    const bookCollections = client.db(dbName).collection(collectionName);

    app.post("/upload-book", async (req, res) => {
      const data = req.body;
      const result = await bookCollections.insertOne(data);
      res.send(result);
    });

    app.get("/all-books", async (req, res) => {
      const query = req.query?.category ? { category: req.query.category } : {};
      const result = await bookCollections.find(query).toArray();
      res.send(result);
    });

    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updateBookData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = { $set: { ...updateBookData } };
      const result = await bookCollections.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollections.deleteOne(filter);
      res.send(result);
    });

    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bookCollections.findOne(filter);
      res.send(result);
    });

    // ---------------- Chat Route ----------------
    app.post('/chat', async (req, res) => {
      const { message } = req.body;
      if (!message) return res.status(400).send({ error: 'Message text is required' });

      try {
        let responseText = '';
        let booksFromDb = [];

        if (message.toLowerCase().includes('tell me about') || message.toLowerCase().includes('book description')) {
          const bookTitle = message.split('about')[1]?.trim();
          const book = await bookCollections.findOne({ bookTitle: new RegExp(bookTitle, 'i') });

          if (book) {
            responseText = `**Book Description for "${book.bookTitle}":**\n> ${book.bookDescription}`;
          } else {
            responseText = `**No description found for "${bookTitle}". Searching external sources...**`;
          }
        }

        res.json({ response: responseText.trim() });
      } catch (error) {
        console.error('Error in /chat route:', error);
        res.status(500).send({ error: 'Failed to process chat request' });
      }
    });

    console.log('✅ Connected successfully to MongoDB');
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err);
  }
}

connect();

// ---------------- Server Start ----------------
app.listen(port, () => {
  console.log(`🚀 App running on http://localhost:${port}`);
});
