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
const Paginator = require('../middlewares/paginator')
const DateCorrector = require('../middlewares/datecorrector')

router.post('/makeReservation', checkAuth, (req, res, next) => {
    Rental.findOne({ _id: new mongoose.Types.ObjectId(req.body.rentalId) })
        .exec()
        .then(rental => {
            isEmailNull(rental.email, res)

            const dayList = desiredDays(new Date(req.body.checkInDate) + 1, new Date(req.body.checkOutDate) - 1)
            dayList.forEach(date => {
                rental.notAvailableDates.push(DateCorrector(date))
            })
            rental.save().catch(err => { return errorHandler._500(err, res) })

            const reservation = new Reservation({
                _id: new mongoose.Types.ObjectId(),
                rentalId: rental._id,
                hostEmail: rental.email,
                guestEmail: req.body.email,
                checkInDate: DateCorrector(new Date(req.body.checkInDate)),
                checkOutDate: DateCorrector(new Date(req.body.checkOutDate)),
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

router.get('/getActiveReservations', checkAuth, async (req, res) => {
    try {
        const reservations = await Reservation.find({ guestEmail: req.body.email,
            checkOutDate: { "$gte": new Date() },
            status: { "$in": [reservationEnum.PENDING, reservationEnum.APPROVED] } }).sort({ checkInDate: -1 })
        return Paginator(reservations, req, res)
    } catch (err) {
        return errorHandler._500(err, res)
    }
})

router.get('/getRejectedReservations', checkAuth, async (req, res) => {
    try {
        const reservations = await Reservation.find({ guestEmail: req.body.email,
            checkOutDate: { "$gte": new Date() },
            status: { "$in": [reservationEnum.CANCELLED, reservationEnum.REJECTED] } }).sort({ checkInDate: -1 })
        return Paginator(reservations, req, res)
    } catch (err) {
        return errorHandler._500(err, res)
    }
})

router.get('/getAllReservationHistory', checkAuth, async (req, res) => {
    try {
        const reservations = await Reservation.find({ guestEmail: req.body.email }).sort({ checkInDate: -1 })
        return Paginator(reservations, req, res)
    } catch (err) {
        return errorHandler._500(err, res)
    }
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

const desiredDays = (checkInDate, checkOutDate) => {
    for(var arr=[], dt=new Date(checkInDate); dt <= checkOutDate; dt.setDate(dt.getDate() + 1)){
        arr.push(new Date(dt));
    }
    return arr;
}

module.exports = router;
