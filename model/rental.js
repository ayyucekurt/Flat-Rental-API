const mongoose = require('mongoose');

const FeaturesSchema = new mongoose.Schema({
    key: String,
    value: String
});

const PricePerNightSchema = new mongoose.Schema({
    amount: Number,
    currency: String
});

const ReviewInfoSchema = new mongoose.Schema({
    reviewDate: Date,
    reviewPoint: Number,
    reviewContent: String,
    reviewerId: String
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
    }
});

module.exports = mongoose.model('Rental', RentalSchema);
