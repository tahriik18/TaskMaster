import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ToDoList.css';

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [tag, setTag] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editTag, setEditTag] = useState('');

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
      priority,
      tag
    })
    .then(() => {
      setNewTask('');
      setDueDate('');
      setPriority('');
      setTag('');
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

  const startEdit = (task) => {
    setEditId(task.task_id);
    setEditTask(task.description);
    setEditDate(task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '');
    setEditPriority(task.priority || '');
    setEditTag(task.tag || '');
  };

  const saveEdit = (id) => {
    axios.put(`http://localhost:3001/api/tasks/edit/${id}`, {
      description: editTask,
      due_date: editDate,
      priority: editPriority,
      tag: editTag
    })
    .then(() => {
      setEditId(null);
      fetchTasks();
    })
    .catch(err => console.error('Error updating task:', err));
  };

  const filteredTasks = tasks.filter(task => {
    const now = new Date();
    const due = task.due_date ? new Date(task.due_date) : null;
    const matchesSearch = task.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'completed') return task.completed;
    if (filter === 'upcoming') return due && due > now && !task.completed;
    if (filter === 'overdue') return due && due < now && !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'date') return new Date(a.due_date) - new Date(b.due_date);
    if (sortBy === 'priority') {
      const order = { High: 1, Medium: 2, Low: 3 };
      return (order[a.priority] || 4) - (order[b.priority] || 4);
    }
    if (sortBy === 'alpha') return a.description.localeCompare(b.description);
    return 0;
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
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="due-date-input"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="priority-select">
          <option value="" disabled>Select Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select value={tag} onChange={(e) => setTag(e.target.value)} className="tag-select">
          <option value="" disabled>Select Tag</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="School">School</option>
        </select>
        <button onClick={addTask} className="add-button">Add</button>
      </div>

      <div className="search-row">
     <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search tasks..."
        className="search-input"
     />
   </div>
      <div className="progress-info">
        <div className="progress-text">{completedCount} of {totalCount} tasks completed</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: percentComplete + '%' }}></div>
        </div>
      </div>

      <div className="sort-filter-row">
        <div className="filter-buttons">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
          <button className={filter === 'upcoming' ? 'active' : ''} onClick={() => setFilter('upcoming')}>Upcoming</button>
          <button className={filter === 'overdue' ? 'active' : ''} onClick={() => setFilter('overdue')}>Overdue</button>
        </div>
        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="date">Due Date</option>
          <option value="priority">Priority</option>
          <option value="alpha">Alphabetical</option>
        </select>
      </div>

      <ul className="task-list">
        {sortedTasks.map(task => {
          const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;

          return (
            <li key={task.task_id} className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
              <input
                type="checkbox"
                checked={!!task.completed}
                onChange={() => toggleCompletion(task)}
              />
              {editId === task.task_id ? (
                <>
                  <input
                    type="text"
                    value={editTask}
                    onChange={(e) => setEditTask(e.target.value)}
                    className="task-input"
                  />
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="due-date-input"
                  />
                  <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)} className="priority-select">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <select value={editTag} onChange={(e) => setEditTag(e.target.value)} className="tag-select">
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="School">School</option>
                  </select>
                  <button onClick={() => saveEdit(task.task_id)} className="add-button">Save</button>
                  <button onClick={() => setEditId(null)} className="delete-button">Cancel</button>
                </>
              ) : (
                <>
                  <div className="task-info">
                    <div className="task-desc">{task.description}</div>
                    {task.due_date && <div className="task-due">Due: {new Date(task.due_date).toLocaleDateString()}</div>}
                    {task.priority && <div className={`task-priority priority-${task.priority}`}>{task.priority}</div>}
                    {task.tag && <div className="task-tag">{task.tag}</div>}
                  </div>
                  <div>
                    <button className="add-button" onClick={() => startEdit(task)}>Edit</button>
                    <button className="delete-button" onClick={() => deleteTask(task.task_id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ToDoList;
