const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    admin: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
        default: "Turkey"
    },
    capital: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('City', citySchema)

