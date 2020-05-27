const mongoose = require('mongoose');

const TotalPriceSchema = new mongoose.Schema({
    amount: Number,
    currency: String
})

const ReservationEnum = {
    PENDING: 0,
    APPROVED: 1,
    REJECTED: 2,
    CANCELLED: 3
}

const ReservationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    hostEmail: {
        type: String,
        required: true
    },
    guestEmail: {
        type: String,
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: TotalPriceSchema,
        required: true
    },
    status: {
        type: Number, /* 0 -> Requested, 1 -> Approved, 2 -> Rejected, 3 -> Cancelled */
        default: ReservationEnum.PENDING,
        required: true
    }
})

module.exports = mongoose.model('Reservation', ReservationSchema)
module.exports.reservationEnum = ReservationEnum
