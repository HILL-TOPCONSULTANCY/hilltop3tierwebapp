const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('./config/db'); // Import the MongoDB connection
const dataRoutes = require('./routes/dataRoutes'); // Import the routes

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', dataRoutes); // Use data routes

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
