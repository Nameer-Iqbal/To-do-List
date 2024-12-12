import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for HTTP requests
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]); // State for storing tasks
  const [newTask, setNewTask] = useState(''); // State for input field
  const [editIndex, setEditIndex] = useState(null); // Tracks which task is being edited
  const [editedTask, setEditedTask] = useState(''); // Stores the updated task text

  // Fetch tasks from backend on component mount
  useEffect(() => {
    axios
      .get('http://localhost:5000/tasks')
      .then((response) => setTasks(response.data))
      .catch((err) => console.error('Error fetching tasks:', err));
  }, []);

  // Function to add a new task
  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      axios
        .post('http://localhost:5000/tasks', { name: newTask })
        .then((response) => {
          setTasks([...tasks, response.data]);
          setNewTask('');
        })
        .catch((err) => console.error('Error adding task:', err));
    }
  };

  // Function to delete a task
  const handleDeleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        const updatedTasks = tasks.filter((task) => task._id !== id);
        setTasks(updatedTasks);
      })
      .catch((err) => console.error('Error deleting task:', err));
  };

  // Function to enter edit mode for a task
  const handleEditTask = (index) => {
    setEditIndex(index);
    setEditedTask(tasks[index].name);
  };

  // Function to save the edited task
  const handleSaveTask = (id, index) => {
    axios
      .put(`http://localhost:5000/tasks/${id}`, { name: editedTask })
      .then(() => {
        const updatedTasks = tasks.map((task, i) =>
          i === index ? { ...task, name: editedTask } : task
        );
        setTasks(updatedTasks);
        setEditIndex(null); // Exit edit mode
      })
      .catch((err) => console.error('Error updating task:', err));
  };

  // Function to handle Enter key press for adding a task
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="App">
      <h1>To-do List</h1>

      {/* Input area for adding a new task */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter a task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown} // Add onKeyDown event to detect Enter key
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {/* Task List */}
      <div className="task-list">
        {tasks.map((task, index) => (
          <div className="task-item" key={task._id}>
            {editIndex === index ? (
              <>
                {/* Edit input when in edit mode */}
                <input
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                />
                <button onClick={() => handleSaveTask(task._id, index)}>Save</button>
              </>
            ) : (
              <>
                {/* Display task text when not in edit mode */}
                <span>{task.name}</span>
                <button onClick={() => handleEditTask(index)}>Edit</button>
                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
