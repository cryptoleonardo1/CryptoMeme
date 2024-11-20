// server/src/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Import routes
const userRoutes = require('./routes/userRoutes');
const memeRoutes = require('./routes/memeRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/memes', memeRoutes);
app.use('/api/tasks', taskRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('CryptoMeme API is running');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});