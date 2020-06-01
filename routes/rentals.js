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
const Feature = require('../model/rental').Feature;
const multer = require('multer');
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const path = `./uploads/${req.userData.userId}/`
        fs.mkdirSync(path, { recursive: true })
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, Date().now + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/addNewRental', checkAuth, checkHosting, upload.array('photos', 6), (req, res, next) => {
    const rentalInfo = JSON.parse(req.body.info)
    const locationInfo = JSON.parse(req.body.location)
    const price = JSON.parse(req.body.price)
    const features = JSON.parse(req.body.features)
    const photosArr = [];

    req.files.forEach(file => {
        photosArr.push(file.path)
    })

    const rental = new Rental({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        rentalInfo: {
            roomCount: rentalInfo.roomCount,
            bedCount: rentalInfo.bedCount,
            bathCount: rentalInfo.bathCount,
            maxGuestsCount: rentalInfo.maxGuestsCount,
            description: rentalInfo.description
        },
        locationInfo: {
            country: locationInfo.country,
            city: locationInfo.city,
            province: locationInfo.province
        },
        price: {
            amount: price.amount,
            currency: price.currency
        },
        photos: photosArr,
        features: features
    });

    rental.save()
        .then(result => {
            console.log(result);
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

router.post('/getSelectedRental', (req, res) => {
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
