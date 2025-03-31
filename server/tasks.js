const express = require('express');
const router = express.Router();
const db = require('./dbConnection');

//get all tasks
router.get('/', (req, res)=>{
    const sql = 'SELECT * FROM tasks';
    db.query(sql, (err, results)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

//Post a new task
router.post('/', (req, res)=>{
    const {description, due_date, priority, assign_to} = req.body;
    const sql = 'INSERT INTO tasks (description, due_date, priority, assign_to) VALUES ( ?,?,?,?)';
    db.query(sql, [description, due_date, priority, assign_to], (err, result)=>{
        if (err){
            console.error(err);
            return res.status(500).send('Server error');
        }
        res.json({success: true, insertId: result.insertId});
    });
});

//Update a task
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body; // expecting a boolean value
    const sql = 'UPDATE tasks SET completed = ? WHERE task_id = ?';
    db.query(sql, [completed, id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
      res.json({ success: true, affectedRows: result.affectedRows });
    });
  });

  //delete a task
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tasks WHERE task_id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
      res.json({ success: true, affectedRows: result.affectedRows });
    });
  });

module.exports = router;