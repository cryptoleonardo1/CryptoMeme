const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' });

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Using URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB!');
    
    // Check connection state
    const state = mongoose.connection.readyState;
    console.log('Connection state:', 
      state === 0 ? 'Disconnected' :
      state === 1 ? 'Connected' :
      state === 2 ? 'Connecting' :
      'Unknown'
    );

    // Try to create a test document
    const TestModel = mongoose.model('Test', new mongoose.Schema({
      name: String,
      date: { type: Date, default: Date.now }
    }));

    const testDoc = await TestModel.create({
      name: 'Test Document'
    });

    console.log('Created test document:', testDoc);

    // Clean up
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('Cleaned up test document');

    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

testConnection();