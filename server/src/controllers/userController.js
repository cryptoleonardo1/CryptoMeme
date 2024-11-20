// src/controllers/userController.js
const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const { telegramId, username, firstName, lastName } = req.body;
    
    let user = await User.findOne({ telegramId });
    
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    user = new User({
      telegramId,
      username,
      firstName,
      lastName
    });
    
    await user.save();
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePoints = async (req, res) => {
  try {
    const { telegramId, points, type } = req.body;
    const user = await User.findOne({ telegramId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.points += points;
    user.totalPoints += points;
    user.statistics[type] += 1;
    
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};