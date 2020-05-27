const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const checkAuth = require('../middlewares/authenticationcontrol')
const checkHosting = require('../middlewares/hostingpreferencecontrol')
const errorHandler = require('../handler/errorhandler')
const successHandler = require('../handler/successhandler')

const User = require('../model/user');
const Rental = require('../model/rental');

router.post('/addNewRental', checkAuth, checkHosting, (req, res, next) => {
    const rental = new Rental({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        rentalInfo: {
            roomCount: req.body.info.roomCount,
            bedCount: req.body.info.bedCount,
            bathCount: req.body.info.bathCount,
            maxGuestsCount: req.body.info.maxGuestsCount,
            description: req.body.info.description
        },
        locationInfo: {
            country: req.body.location.country,
            city: req.body.location.city,
            province: req.body.location.province
        },
        price: {
            amount: req.body.price.amount,
            currency: req.body.price.currency
        },
        photos: req.body.photos,
        features: req.body.features
    })

    rental.save()
        .then(result => {
            console.log(result)
            return successHandler._201(res)
        })
        .catch(err => {
            return errorHandler._500(err, res)
        })
})

// Searching
// Not Working
router.get('/getRentals', (req, res) => {
    return rentalPaginator({ locationInfo: req.body.location }, req, res)
})

const rentalPaginator = (query, req, res) => {
    const page = parseInt(req.body.page)
    const limit = parseInt(req.body.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < Rental.countDocuments().exec()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }

    Rental.find(query)
        .sort({ _id: 1 })
        .limit(limit)
        .skip(startIndex)
        .exec()
        .then(rentals => {
            results.rentals = rentals
            return res.status(200).json({ message: 'success', results })
        }).catch(err => {
        return errorHandler._500(err, res)
    })
}

module.exports = router;
