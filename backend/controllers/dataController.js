const Data = require('../models/Data');

// Handle data submission
exports.submitData = async (req, res) => {
  try {
    const { name, value } = req.body;
    const newData = new Data({ name, value });
    await newData.save();
    res.status(201).json({ message: 'Data submitted successfully', data: newData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit data' });
  }
};

// Fetch all data
exports.fetchData = async (req, res) => {
  try {
    const data = await Data.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
