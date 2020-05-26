const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const checkAuth = require('../middlewares/authenticationcontrol')
const errorHandler = require('../handler/errorhandler')
const successHandler = require('../handler/successhandler')
const User = require('../model/user');

router.post('/updatePhoneNumber', checkAuth, (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            isUserNull(user)

            user.personalInfo.phoneNumber = req.body.phoneNumber
            user.save()
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

router.post('/updateUserDocuments', checkAuth, (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            isUserNull(user)
            user.personalDocuments = req.body.personalDocuments
            user.save()
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

router.post('/updatePersonalInformation', checkAuth, (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            isUserNull(user)
            user.personalInfo.name = req.body.name
            user.personalInfo.surname = req.body.surname
            user.personalInfo.birthOfDate = req.body.birthOfDate

            user.save()
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

router.post('/changePassword', checkAuth, (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            isUserNull(user)
            const oldPassword = req.body.oldpassword
            bcrypt.compare(oldPassword, user.password, (err, result) => {
                if (err) {
                    return errorHandler._401(res)
                }

                if (result) {
                    return hashPassword(user, req, res)
                }
                return errorHandler._401(res)
            })
        })
        .catch(err => {
            return errorHandler._500(err, res)
        })
})

const isUserNull = user => {
    if (user === null) {
        return errorHandler._401(res)
    }
};

const hashPassword = (user, req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return errorHandler._500(err, res)
        }

        user.password = hash

        user.save()
            .then(result => {
                console.log(result)
                return successHandler._201(res)
            })
            .catch(savingError => {
                return errorHandler._500(savingError, res)
            })
    })
}

module.exports = router;
