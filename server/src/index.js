require('dotenv').config();
const app = require('./app');  // Updated path to point to app.js in the same directory
const connectDB = require('./config/database');

const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`
🚀 Server is running on port ${PORT}
📱 Environment: ${process.env.NODE_ENV}
📂 MongoDB: Connected
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();