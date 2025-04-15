const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;


app.use(cors()); 
app.use(express.json());

// Routes
const tasksRoutes = require('./tasks');
app.use('/api/tasks', tasksRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
