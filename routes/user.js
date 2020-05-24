const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../model/user');

router.post('/register', (req, res, next) => {
    bcrypt.hash(req.body.password, 13, (err, hash) => {
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
            user.save().then(result => {
                console.log(result)
                res.status(201).json({ message: 'User is created' })
            }).catch(err => {
                res.status(500).json({ message: err.message })
            })
        }
    })
})

module.exports = router;