const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('dotenv').config();
const checkAuth = require('../middlewares/authenticationcontrol')
const errorHandler = require('../handler/errorhandler')
const successHandler = require('../handler/successhandler')

const User = require('../model/user');
const Rental = require('../model/rental')
const Reservation = require('../model/reservation')
const reservationEnum = require('../model/reservation').reservationEnum

router.post('/makeReservation', checkAuth, (req, res, next) => {
    Rental.findOne({ _id: new mongoose.Types.ObjectId(req.body.rentalId) })
        .exec()
        .then(rental => {
            isEmailNull(rental.email, res)

            const reservation = new Reservation({
                _id: new mongoose.Types.ObjectId(),
                hostEmail: rental.email,
                guestEmail: req.body.email,
                checkInDate: req.body.checkInDate,
                checkOutDate: req.body.checkOutDate,
                totalPrice: req.body.price
            })

            reservation.save()
                .then(result => {
                    console.log(result)
                    return successHandler._201(res)
                })
                .catch(errSaving => {
                    return errorHandler._500(errSaving, res)
                })
        })
        .catch(err => {
            return errorHandler._500(err, res)
        })
})

router.post('/approveReservation', checkAuth, (req, res) => {
    changeReservationStatus(reservationEnum.APPROVED, req, res)
})

router.post('/rejectReservation', checkAuth, (req, res) => {
    changeReservationStatus(reservationEnum.REJECTED, req, res)
})

router.post('/cancelReservation', checkAuth, (req, res) => {
    changeReservationStatus(reservationEnum.CANCELLED, req, res)
})

router.get('/getActiveReservations', checkAuth, (req, res) => {
    /* Reservation.find({ guestEmail: req.body.email,
        checkOutDate: { "$gte": new Date() },
        status: { "$in": [reservationEnum.PENDING, reservationEnum.APPROVED] }
    }).exec()
        .then(reservations => {
            return res.status(200).json({ message: 'success', "activeReservations": reservations })
        })
        .catch(err => {
            return errorHandler._500(err, res)
        }) */
    return reservationPaginator({ guestEmail: req.body.email,
            checkOutDate: { "$gte": new Date() },
            status: { "$in": [reservationEnum.PENDING, reservationEnum.APPROVED] } },
        req, res)
})

router.get('/getRejectedReservations', checkAuth, (req, res) => {
    return reservationPaginator({ guestEmail: req.body.email,
            checkOutDate: { "$gte": new Date() },
            status: { "$in": [reservationEnum.CANCELLED, reservationEnum.REJECTED] } },
        req, res)
})

router.get('/getAllReservationHistory', checkAuth, (req, res) => {
    return reservationPaginator( { guestEmail: req.body.email }, req, res)
})

const isEmailNull = (email, res) => {
    if (email === null) {
        return errorHandler._401(res)
    }
};

const changeReservationStatus = (status, req, res) => {
    Reservation.findOne({ _id: new mongoose.Types.ObjectId(req.body.reservationId) })
        .exec()
        .then(reservation => {
            reservation.status = status
            reservation.save()
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
}

const reservationPaginator = (query, req, res) => {
    const page = parseInt(req.body.page)
    const limit = parseInt(req.body.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < Reservation.countDocuments().exec()) {
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

    Reservation.find(query)
        .sort({ _id: 1 })
        .limit(limit)
        .skip(startIndex)
        .exec()
        .then(reservations => {
            results.reservations = reservations
            return res.status(200).json({ message: 'success', results })
        }).catch(err => {
        return errorHandler._500(err, res)
    })
}

module.exports = router;
