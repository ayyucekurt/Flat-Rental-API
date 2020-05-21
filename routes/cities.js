const express = require('express');
const router = express.Router();
const City = require('../model/city');

// localhost:3000/cities/getProvinces
router.get('/getProvinces', async  (req, res) => {
    try {
        const provinces = await City.find({ capital:'admin' },{ _id: 0, city: 1 }).sort({admin: 1})
        await res.json(provinces)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting Districts
// localhost:3000/cities/Adana
router.get('/:admin', getDistrict, (req, res) => {
    res.send(res.city)
})

module.exports = router;

async function getDistrict(req, res, next) {
    let districts
    try {
        districts = await City.find({ admin: req.params.admin, capital: 'minor' },{ _id: 0, city: 1}).sort({ city: 1 })
        if (districts == null) {
            return res.status(404).json({ message: '404' })
        }

    } catch (err) {
        res.status(500).json({ message: err.message })
    }

    res.city = districts
    next()
}
