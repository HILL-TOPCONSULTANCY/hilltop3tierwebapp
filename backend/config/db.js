const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/mydatabase';

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

module.exports = mongoose;
