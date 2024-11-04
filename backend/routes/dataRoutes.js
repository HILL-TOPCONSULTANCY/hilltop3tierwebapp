const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.post('/submit', dataController.submitData);
router.get('/fetch', dataController.fetchData);

module.exports = router;
