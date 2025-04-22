import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ToDoList.css';

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editDesc, setEditDesc] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [priority, setPriority] = useState("");
  const [editPriority, setEditPriority] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:3001/api/tasks')
      .then(res => {
        const sorted = res.data.sort((a, b) => {
          // Define order of priorities
          const priorityOrder = { "High": 1, "Medium": 2, "Low": 3, "": 4, null: 4 };
  
          // Put incomplete tasks first, completed ones last
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
  
          // sort by priority
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
  
        setTasks(sorted);
      })
      .catch(err => console.error('Error fetching tasks:', err));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const formattedDate = dueDate ? new Date(dueDate).toISOString().split('T')[0] : null;

    axios.post('http://localhost:3001/api/tasks', {
      description: newTask,
      due_date: formattedDate,
      priority: priority || null
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

  const startEditing = (task) => {
    setEditingTaskId(task.task_id);
    setEditDesc(task.description);
    setEditDueDate(task.due_date ? task.due_date.split('T')[0] : '');
  };

  const saveEdit = (id) => {
    const formattedDate = editDueDate ? new Date(editDueDate).toISOString().split('T')[0] : null;
    axios.put(`http://localhost:3001/api/tasks/edit/${id}`, {
      description: editDesc,
      due_date: formattedDate
    })
    .then(() => {
      setEditingTaskId(null);
      fetchTasks();
    })
    .catch(err => console.error('Error updating task:', err));
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditDesc('');
    setEditDueDate('');
  };

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
        <select
  value={priority}
  onChange={(e) => setPriority(e.target.value)}
  className="priority-input"
>
  <option value="">Priority</option>
  <option value="Low">Low</option>
  <option value="Medium">Medium</option>
  <option value="High">High</option>
</select>
        <button onClick={addTask} className="add-button">Add</button>
      </div>

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.task_id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={!!task.completed}
              onChange={() => toggleCompletion(task)}
            />

            {editingTaskId === task.task_id ? (
              <div className="task-info">
                <input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="task-input"
                />
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="due-date-input"
                />
                <button className="add-button" onClick={() => saveEdit(task.task_id)}>Save</button>
                <button className="delete-button" onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <>
                <div className="task-info">
                  <div className="task-desc">{task.description}</div>

                  {task.priority &&(
                    <div className="task-priority">Priority: {task.priority}</div>
                  )}
                  {task.due_date && (
                    <div className="task-due">Due: {new Date(task.due_date).toLocaleDateString()}</div>
                  )}
                </div>
                <div>
                  <button className="delete-button" onClick={() => startEditing(task)}>✏️</button>
                  <button className="delete-button" onClick={() => deleteTask(task.task_id)}>🗑</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoList;