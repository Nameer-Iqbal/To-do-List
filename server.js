const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Create an Express app
const app = express();
app.use(cors());
app.use(express.json()); // Middleware for parsing JSON

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/" 
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Define a schema for tasks
const taskSchema = new mongoose.Schema({
  name: String,
  status: String,
  priority: String,
  created_at: { type: Date, default: Date.now },
});

// Create a model for tasks
const Task = mongoose.model("Task", taskSchema);

// Routes
// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add a new task
app.post("/tasks", async (req, res) => {
  const { name, status, priority } = req.body;
  const newTask = new Task({ name, status, priority });
  await newTask.save();
  res.json(newTask);
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ message: "Task deleted" });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
