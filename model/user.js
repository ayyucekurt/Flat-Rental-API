const mongoose = require('mongoose');

const PersonalInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    birthOfDate: {
        type: Date,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
    }
});

const PersonalDocumentsSchema = new mongoose.Schema({
    name: String,
    value: String
});

const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId
    ,email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    personalInfo: {
        type: PersonalInfoSchema,
        required: true
    },
    personalDocuments: {
        type: [PersonalDocumentsSchema],
        required: false
    }
});

module.exports = mongoose.model('User', UserSchema)

