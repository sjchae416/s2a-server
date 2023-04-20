const express = require('express');
const router = express.Router();
const Developer = require('../models/Developer');

// ROUTE Crud - create a Developer
router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    const newDeveloper = await Developer.create({
      email: email,
    });

    res.status(200).json({
      error: false,
      message: 'Successfully created a new Developer',
      developer: newDeveloper,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Failed to create a new Developer',
      error: error,
    });
  }
});

// ROUTE Crud - get all Developers
router.get('/', async (req, res) => {
  try {
    const developers = await Developer.find();
    
    res.status(200).json({
      error: false,
      message: 'Successfully retrieved all Developers',
      developers: developers,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: 'Failed to retrieve all Developers',
      error: error,
    });
  }
});







module.exports = router;