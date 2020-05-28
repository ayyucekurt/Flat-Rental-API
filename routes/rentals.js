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
const Feature = require('../model/rental').Feature

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

router.post('/deleteRental', checkAuth, (req, res, next) => {
    Rental.findOne({ _id: req.body.id })
            .exec()
            .then( rental => {
                if (rental == null) {
                    return errorHandler._401(res)
                } else {
                    rental.deleteOne();
                    rental.save();
                    return successHandler._201(res)
                }
            })
            .catch(err => {
            return errorHandler._500(err, res)
            })
})

router.post('/updateFeatures', checkAuth, (req, res, next) => {
    Rental.findOne({ _id: req.body.id })
        .exec()
        .then(rental => {
            if (rental === null) {
                return errorHandler._401(res)
            } else {
                rental.features = req.body.features
            }
            rental.save()
                .then(result => {
                    console.log(result)
                    return successHandler._201(res)
                })
                .catch(err => {
                    return errorHandler._500(err, res)
                })
        })
        .catch(err => {
            return errorHandler._500(err, res)
        })
})

router.post('/updatePhotos', checkAuth, (req, res, next) => {
    Rental.findOne({ _id: req.body.id })
        .exec()
        .then(rental => {
            if (rental == null) {
                return errorHandler._401(res)
            } else {
                let arr = new Array()
                arr = req.body.photos
                arr.forEach( it => {
                    rental.photos.push(it)
                })
            }
            rental.save()
                .then(result => {
                    console.log(result)
                    return successHandler._201(res)
                })
                .catch(err => {
                    return errorHandler._500(err, res)
                })
        })
        .catch(err => {
            return errorHandler._500(err, res)
        })
})

router.post('/updateDescription', checkAuth, (req, res, next) => {
    Rental.findOne({ _id: req.body.id })
        .exec()
        .then(rental => {
            if (rental === null) {
                return errorHandler._401(res)
            } else {
                rental.rentalInfo.description = req.body.description
            }
            rental.save()
                .then(result => {
                    console.log(result)
                    return successHandler._201(res)
                })
                .catch(err => {
                    return errorHandler._500(err, res)
                })
        })
        .catch(err => {
            return errorHandler._500(err, res)
        })
})

router.get('/getSelectedRental', (req, res) => {
    Rental.findOne({ _id: req.body.id })
        .exec()
        .then(rental => {
            if (rental == null) {
                return errorHandler._401(res)
            } else {
                return res.status(200).json(rental)
                //res.send(res)
            }
        })
        .catch(err => {
            return errorHandler._500(err, res)
        })
});

module.exports = router;
