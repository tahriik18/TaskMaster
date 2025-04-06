# TaskMaster
Task master is a full-stack to-do list application built with: 
- **Frontend:** React
- **Backend:** Node.js and Express
- **Database:** MySQL (locally hosted)

It helps users **create**, **view**, **update**, and **delete** tasks.

---


## Local One-Time MySQL setup
Each teammate must create their own local database by running the setup script

### steps:
1. Open the file: 
   `server/setupDatabase.js`

2. Update the following section with **your own MySQL credentials**:

```js
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  multipleStatements: true
});
```

3. Open your terminal and run:
```bash
cd server
node setupDatabase.js
```

This will create the `taskmaster` database and `tasks` table on your local MySQL server.
