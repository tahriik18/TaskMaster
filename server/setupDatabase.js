const mysql = require('mysql2');

// Update these credentials with your local MySQL login
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',               // change this to your own MySQL username
  password: 'yourpassword',   // Change this to your own MySQL password
  multipleStatements: true   
});

const schema = `
CREATE DATABASE IF NOT EXISTS taskmaster;
USE taskmaster;

CREATE TABLE IF NOT EXISTS tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255),
  due_date DATE,
  completed TINYINT(1),
  priority VARCHAR(50),
  assign_to VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

db.query(schema, (err, result) => {
  if (err) {
    console.error('Error setting up the database or table:', err);
  } else {
    console.log('taskmaster database and tasks table created (or already existed).');
  }
  db.end(); // close connection
});
