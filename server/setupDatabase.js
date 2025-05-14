const mysql = require('mysql2');

// Update these credentials with your local MySQL login
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Studybuddy490!',
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

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.query(schema, (err, result) => {
  if (err) {
    console.error('Error setting up the database or tables:', err);
  } else {
    console.log('taskmaster database, tasks table, and users table created (or already existed).');
  }
  db.end();
});
