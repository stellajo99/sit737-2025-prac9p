/*
This is an advanced calculator microservice built using Node.js and Express. 
The API supports basic arithmetic operations such as addition, subtraction, multiplication, division,
exponentiation, square root, and modulo operations through REST API.
*/

// MongoDB connect
const mongoose = require('mongoose');

const dbUser = process.env.MONGO_USER;
const dbPass = process.env.MONGO_PASSWORD;

mongoose.connect(`mongodb://${dbUser}:${dbPass}@mongodb:27017/calculator?authSource=admin`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const CalcLog = mongoose.model("CalcLog", {
  input: String,
  output: String,
  timestamp: { type: Date, default: Date.now }
});

const bodyParser = require('body-parser'); 
const express = require('express'); // Import Express.js framework
const fs = require('fs');
const winston = require('winston'); // Import the Winston logging library

const app = express(); // Create an Express application instance
app.use(bodyParser.json());
const port = 3000; // Assign port numver

// Configure Winston logger with console and file transports
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'calculator-microservice' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Helper function to validate input numbers
function validateNumbers(num1, num2) {
  if (num1 === undefined || num2 === undefined || num1 === '' || num2 === '') {
    return 'Both num1 and num2 are required.';
  }

  if (isNaN(num1) || isNaN(num2)) {
    return 'Both num1 and num2 should be valid numbers.';
  }

  return null;
}

// --- API endpoints ---

app.get('/', (req, res) => {
  res.send("Task 9.1P - Updated!");
});


// --- Basic operations ---
// Add
app.get('/add', (req, res) => {
  const { num1, num2 } = req.query;
  const operation = '+';
  logger.log({
    level: 'info',
    message: `New ${operation} operation requested: ${num1} ${operation} ${num2}`,
  });

  const error = validateNumbers(num1, num2);
  if (error) {
    logger.log({ level: 'error', message: error });
    return res.status(400).json({ error });
  }

  res.json({ result: parseFloat(num1) + parseFloat(num2) });
});

// Subtract
app.get('/subtract', (req, res) => {
  const { num1, num2 } = req.query;
  const operation = '-';
  logger.log({
    level: 'info',
    message: `New ${operation} operation requested: ${num1} ${operation} ${num2}`,
  });

  const error = validateNumbers(num1, num2);
  if (error) {
    logger.log({ level: 'error', message: error });
    return res.status(400).json({ error });
  }

  res.json({ result: parseFloat(num1) - parseFloat(num2) });
});

// Multiply
app.get('/multiply', (req, res) => {
  const { num1, num2 } = req.query;
  const operation = '*';
  logger.log({
    level: 'info',
    message: `New ${operation} operation requested: ${num1} ${operation} ${num2}`,
  });

  const error = validateNumbers(num1, num2);
  if (error) {
    logger.log({ level: 'error', message: error });
    return res.status(400).json({ error });
  }

  res.json({ result: parseFloat(num1) * parseFloat(num2) });
});

// Divide
app.get('/divide', (req, res) => {
  const { num1, num2 } = req.query;
  const operation = '/';
  logger.log({
    level: 'info',
    message: `New ${operation} operation requested: ${num1} ${operation} ${num2}`,
  });

  const error = validateNumbers(num1, num2);
  if (error) {
    logger.log({ level: 'error', message: error });
    return res.status(400).json({ error });
  }

  if (parseFloat(num2) === 0) {
    const msg = 'Cannot divide by zero.';
    logger.log({ level: 'error', message: msg });
    return res.status(400).json({ error: msg });
  }

  res.json({ result: parseFloat(num1) / parseFloat(num2) });
});

// --- Advanced operations ---
// Exponentiation
app.get('/power', (req, res) => {
  const { num1, num2 } = req.query;
  const operation = '^';
  logger.log({ level: 'info', message: `New ${operation} operation requested: ${num1} ^ ${num2}` });

  const error = validateNumbers(num1, num2);
  if (error) {
    logger.log({ level: 'error', message: error });
    return res.status(400).json({ error });
  }

  res.json({ result: Math.pow(parseFloat(num1), parseFloat(num2)) });
});

// Square root (num1 needed only)
app.get('/sqrt', (req, res) => {
  const { num1 } = req.query;
  const operation = 'sqrt';
  logger.log({ level: 'info', message: `New ${operation} operation requested: sqrt(${num1})` });

  const error = validateNumbers(num1, 1); // Only num1 is needed, therefore num2 does not have to be validated. 
  if (error) {
    logger.log({ level: 'error', message: error });
    return res.status(400).json({ error });
  }

  if (parseFloat(num1) < 0) {
    const msg = 'Cannot take square root of a negative number.';
    logger.log({ level: 'error', message: msg });
    return res.status(400).json({ error: msg });
  }

  res.json({ result: Math.sqrt(parseFloat(num1)) });
});

// Modulo: num1 % num2
app.get('/modulo', (req, res) => {
  const { num1, num2 } = req.query;
  const operation = '%';
  logger.log({ level: 'info', message: `New ${operation} operation requested: ${num1} % ${num2}` });

  const error = validateNumbers(num1, num2);
  if (error) {
    logger.log({ level: 'error', message: error });
    return res.status(400).json({ error });
  }

  if (parseFloat(num2) === 0) {
    const msg = 'Cannot divide by zero in modulo operation.';
    logger.log({ level: 'error', message: msg });
    return res.status(400).json({ error: msg });
  }

  res.json({ result: parseFloat(num1) % parseFloat(num2) });
});

// Start the server
app.listen(port, () => {
  logger.log({ level: 'info', message: `Server running at http://localhost:${port}` });
  console.log(`Arithmetic microservice is running on http://localhost:${port}`);
});

// API for Create
app.post('/api/log', async (req, res) => {
  try {
    const log = new CalcLog(req.body);
    await log.save();
    res.json({ success: true, log });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API for Read
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await CalcLog.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/log/:id', async (req, res) => {
  try {
    const updated = await CalcLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/log/:id', async (req, res) => {
  try {
    await CalcLog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Log deleted." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
