// src/controllers/taskController.js
const Task = require('../models/Task');
const PointsTransaction = require('../models/Points');

exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const { taskId, userId } = req.body;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user already completed this task
    const alreadyCompleted = task.completions.some(
      completion => completion.user.toString() === userId
    );
    
    if (alreadyCompleted && !task.settings.isRepeatable) {
      return res.status(400).json({ message: 'Task already completed' });
    }
    
    // Record completion
    task.completions.push({
      user: userId,
      completedAt: new Date(),
      verified: true
    });
    
    await task.save();
    
    // Record points transaction
    await PointsTransaction.create({
      user: userId,
      amount: task.points,
      type: 'earn',
      source: 'task',
      relatedEntity: {
        entityType: 'task',
        entityId: task._id
      },
      description: `Completed task: ${task.action}`
    });
    
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};