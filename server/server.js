const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors()); 
app.use(express.json());


const tasksRoutes = require('./tasks');
const authRoutes = require('./auth');

app.use('/api/tasks', tasksRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Server is running!');
});


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
