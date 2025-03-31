const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Studybuddy490!',
    database: 'taskmaster'
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('MySQL connected successfully!');
  });

console.log('db object:', db);
module.exports = db;

  module.exports = db;