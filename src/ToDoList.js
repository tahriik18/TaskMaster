
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ToDoList.css';

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:3001/api/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error fetching tasks:', err));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const formattedDate = dueDate ? new Date(dueDate).toISOString().split('T')[0] : null;

    axios.post('http://localhost:3001/api/tasks', {
      description: newTask,
      due_date: formattedDate,
      priority
    })
    .then(() => {
      setNewTask('');
      setDueDate('');
      setPriority('');
      fetchTasks();
    })
    .catch(err => console.error('Error adding task:', err));
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:3001/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task.task_id !== id)))
      .catch(err => console.error('Error deleting task:', err));
  };

  const toggleCompletion = (task) => {
    axios.put(`http://localhost:3001/api/tasks/${task.task_id}`, {
      completed: !task.completed
    })
    .then(fetchTasks)
    .catch(err => console.error('Error toggling task:', err));
  };

  const filteredTasks = tasks.filter(task => {
    const now = new Date();
    const due = task.due_date ? new Date(task.due_date) : null;

    if (filter === 'completed') return task.completed;
    if (filter === 'upcoming') return due && due > now && !task.completed;
    if (filter === 'overdue') return due && due < now && !task.completed;
    return true;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const percentComplete = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="todo-container">
      <h1 className="title">TaskMaster</h1>

      <div className="input-area">
        <input
          type="text"
          value={newTask}
          placeholder="Add a new task..."
          onChange={(e) => setNewTask(e.target.value)}
          className="task-input"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="due-date-input"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="priority-select">
          <option value="">Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button onClick={addTask} className="add-button">Add</button>
      </div>

      <div className="progress-info">
        <div className="progress-text">{completedCount} of {totalCount} tasks completed</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: percentComplete + '%' }}></div>
        </div>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('upcoming')}>Upcoming</button>
        <button onClick={() => setFilter('overdue')}>Overdue</button>
      </div>

      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.task_id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={!!task.completed}
              onChange={() => toggleCompletion(task)}
            />
            <div className="task-info">
              <div className="task-desc">{task.description}</div>
              {task.due_date && (
                <div className="task-due">Due: {new Date(task.due_date).toLocaleDateString()}</div>
              )}
              {task.priority && (
                <div className={`task-priority priority-${task.priority}`}>{task.priority}</div>
              )}
            </div>
            <div>
              <button className="delete-button" onClick={() => deleteTask(task.task_id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoList;
