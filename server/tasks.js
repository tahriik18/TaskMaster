const express = require('express');
const router = express.Router();
const db = require('./dbConnection');

// Get all tasks
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM tasks';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send('Server error');
    res.json(results);
  });
});

// Create a new task 
router.post('/', (req, res) => {
  const { description, due_date, priority } = req.body;
  if (!description?.trim()) return res.status(400).send('Description is required');

  const sql = `
    INSERT INTO tasks (description, due_date, completed, priority, assign_to)
    VALUES (?, ?, 0, ?, NULL)
  `;

  db.query(sql, [description, due_date || null, priority || null], (err, result) => {
    if (err) return res.status(500).send('Server error');
    res.json({ success: true, insertId: result.insertId });
  });
});

// Update completion status
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const sql = 'UPDATE tasks SET completed = ? WHERE task_id = ?';
  db.query(sql, [completed, id], (err, result) => {
    if (err) return res.status(500).send('Server error');
    res.json({ success: true, affectedRows: result.affectedRows });
  });
});

// Edit description, due_date, and priority
router.put('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { description, due_date, priority } = req.body;

  const sql = 'UPDATE tasks SET description = ?, due_date = ?, priority = ? WHERE task_id = ?';
  db.query(sql, [description, due_date || null, priority || null, id], (err, result) => {
    if (err) return res.status(500).send('Server error');
    res.json({ success: true, affectedRows: result.affectedRows });
  });
});

// Delete task
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM tasks WHERE task_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send('Server error');
    res.json({ success: true, affectedRows: result.affectedRows });
  });
});

module.exports = router;
