const express = require('express');
const router = express.Router();
const db = require('./dbConnection');

//Retrieves all tasks from database
router.get('/', (req, res)=>{
  //SQL query to select all tasks
    const sql = 'SELECT * FROM tasks';

    //execute the query
    db.query(sql, (err, results)=>{
        if(err){
            console.error(err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

//Creates a new task in the database
router.post('/', (req, res)=>{
    const {description, due_date, priority, assign_to} = req.body;

    //SQL query to insert a new task into the tasks table
    const sql = 'INSERT INTO tasks (description, due_date, priority, assign_to) VALUES ( ?,?,?,?)';
    db.query(sql, [description, due_date, priority, assign_to], (err, result)=>{
        if (err){
            console.error(err);
            return res.status(500).send('Server error');
        }
        res.json({success: true, insertId: result.insertId});
    });
});

//Update a task's status based on its ID (example: mark it as complete)
router.put('/:id', (req, res) => {
  //retrieve task id
    const { id } = req.params;

    const { completed } = req.body; // expecting a boolean value
    
    //SQL query to update the task's completed status based on its ID
    const sql = 'UPDATE tasks SET completed = ? WHERE task_id = ?';
    db.query(sql, [completed, id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
      res.json({ success: true, affectedRows: result.affectedRows });
    });
  });

  //delete a task from database based on its ID
  router.delete('/:id', (req, res) => {
    const { id } = req.params;

    //SQL query to delete the dask with the given ID
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