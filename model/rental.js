const mongoose = require('mongoose');
const DateCorrector = require('../middlewares/datecorrector')

const FeaturesSchema = new mongoose.Schema({
    key: String,
    value: String
});

const PricePerNightSchema = new mongoose.Schema({
    amount: Number,
    currency: String
});

const ReviewInfoSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reviewDate: { type: Date, required: true },
    reviewPoint: { type: Number, required: true },
    reviewContent: { type: String, required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const LocationSchema = new mongoose.Schema({
    country: String,
    city: String,
    province: String
});

const RentalInfoSchema = new mongoose.Schema({
    roomCount: Number,
    bedCount: Number,
    bathCount: Number,
    maxGuestsCount: Number,
    description: String
});

const RentalSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true
    },
    rentalInfo: {
        type: RentalInfoSchema,
        required: true
    },
    locationInfo: {
        type: LocationSchema,
        required: true
    },
    reviews: {
        type: [ReviewInfoSchema],
        required: false
    },
    price: {
        type: PricePerNightSchema,
        required: true
    },
    notAvailableDates: {
        type: [Date],
        required: false
    },
    photos: [String],
    features: {
        type: [FeaturesSchema],
        required: true
    },
    rentalAddedDate: {
        type: Date,
        default: DateCorrector(new Date(Date.now())),
        required: true
    }
});

module.exports.Feature = mongoose.model('Feature', FeaturesSchema);
module.exports = mongoose.model('Rental', RentalSchema);
module.exports.Location = mongoose.model('Location', LocationSchema)
module.exports.Review = mongoose.model('Review', ReviewInfoSchema)
