const express = require('express');
const router = express.Router();
const errorHandler = require('../handler/errorhandler')
const successHandler = require('../handler/successhandler')
const Paginator = require('../middlewares/paginator')

const Rentals = require('../model/rental');

// Searching sorting can be made by different types - date old new etc
router.get('/searchRentals', async (req, res) => {
    try {
        const rentals = await Rentals.find({ 'locationInfo.country': req.body.location.country,
            'locationInfo.city': req.body.location.city,
            'locationInfo.province': req.body.location.province }).sort({ _id: 1 })
        return Paginator(rentals, req, res)
    } catch (err) {
        return errorHandler._500(err, res)
    }
})

router.get('/getCheapestRentals', async (req, res) => {
    try {
        const rentals = await Rentals.find({ 'locationInfo.country': req.body.location.country,
            'locationInfo.city': req.body.location.city,
            'locationInfo.province': req.body.location.province }).sort({ 'price.amount': 1 })
        return Paginator(rentals, req, res)
    } catch (err) {
        return errorHandler._500(err, res)
    }
})

router.get('/getExpensiveRentals', async (req, res) => {
    try {
        const rentals = await Rentals.find({ 'locationInfo.country': req.body.location.country,
            'locationInfo.city': req.body.location.city,
            'locationInfo.province': req.body.location.province }).sort({ 'price.amount': -1 })
        return Paginator(rentals, req, res)
    } catch (err) {
        return errorHandler._500(err, res)
    }
})

router.get('/getHighestReviews', async (req, res) => {
    try {
        const rentals = await Rentals.find({ 'locationInfo.country': req.body.location.country,
            'locationInfo.city': req.body.location.city,
            'locationInfo.province': req.body.location.province }).sort({ avgPoints: -1 })
        return Paginator(rentals, req, res)
    } catch (err) {
        return errorHandler._500(err, res)
    }
})

router.get('/getNewRentals', async (req, res) => {
    try {
        const rentals = await Rentals.find({ 'locationInfo.country': req.body.location.country,
            'locationInfo.city': req.body.location.city,
            'locationInfo.province': req.body.location.province }).sort({ rentalAddedDate: -1 })
        return Paginator(rentals, req, res)
    } catch (err) {
        return errorHandler._500(err, res)
    }
})

module.exports = router;
