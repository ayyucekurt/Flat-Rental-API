const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const checkAuth = require('../middlewares/authenticationcontrol')
const errorHandler = require('../handler/errorhandler')
const successHandler = require('../handler/successhandler')
const DateCorrector = require('../middlewares/datecorrector')
const Rental = require('../model/rental')
const Review = require('../model/rental').Review

router.get('/addReview', checkAuth, async (req, res) => {
    Rental.findOne({ _id: req.body.rentalId })
        .exec()
        .then(rental => {
            rental.reviews.push(new Review({
                _id: new mongoose.Types.ObjectId(),
                reviewDate: DateCorrector(new Date(Date.now())),
                reviewPoint: req.body.reviewPoint,
                reviewContent: req.body.reviewContent,
                reviewerId: req.body.reviewerId
            }))

            Rental.aggregate([
                {$unwind: "$reviews"},
                {$match: {_id: mongoose.Types.ObjectId(rental._id) }},
                {$group: {_id: null, avgScore: {$avg: "$reviews.reviewPoint"}}}
            ]).exec((aggregateErr, review) => {
                if (aggregateErr) {
                    errorHandler._500(aggregateErr, res)
                }
                console.log(review);
                rental.avgPoints = review.avgPoints

                rental.save()
                    .then(result => {
                        console.log(result)
                        return successHandler._201(res)
                    })
                    .catch(err => {
                        return errorHandler._500(err, res)
                    })
            })
        })
        .catch(err => {
            return errorHandler._500(err, res)
        })
})

module.exports = router;
