const express = require('express');
const router = express.Router();
const City = require('../model/city');

// Getting all
router.get('/', async (req, res) => {
    try {
        const cities = await City.find()
        await res.json(cities)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

module.exports = router;

