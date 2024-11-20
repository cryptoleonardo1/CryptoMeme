const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { setupHandlers } = require('./handlers');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

setupHandlers(bot);

console.log('Bot is running...');