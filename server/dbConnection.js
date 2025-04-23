const mysql = require('mysql2');

//create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Finalfantasy18@',
    database: 'taskmaster'
});

//connect to the database
db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('MySQL connected successfully!');
  });

console.log('db object:', db);

module.exports = db;
