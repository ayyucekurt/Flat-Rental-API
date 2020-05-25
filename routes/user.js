const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();


const User = require('../model/user');

router.post('/register', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "User exists!"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ message: err.message })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            personalInfo: {
                                name: req.body.info.name,
                                surname: req.body.info.surname,
                                birthOfDate: req.body.info.birthOfDate,
                                phoneNumber: req.body.info.phoneNumber
                            }
                        })
                        user.save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({ message: 'User is created' })
                            }).catch(err => {
                            res.status(500).json({ message: err.message })
                        })
                    }
                })
            }
        })
})

router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (user === null) {
                return get401(res)
            }

            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return get401(res)
                }

                if(result) {
                    const token = jwt.sign({
                            email: user.email,
                            userId: user._id
                        },
                        process.env.PRIVATE_KEY,
                        {
                            expiresIn: "1h"
                        }
                    )
                    return res.status(200).json({
                        message: 'Authentication successful.',
                        token: token
                    })
                }
                return get401(res)
            })
        })
        .catch(err => {
            return get500(err, res)
        })
})

module.exports = router;

// Error Handing
function get401(res) {
    return res.status(401).json({
        message: 'Authentication failed.'
    })
}

function get500(err, res) {
    console.log(err)
    res.status(500).json({
        message: err.message
    })
}