require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true,  useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

const citiesRouter = require('./routes/cities');
app.use('/cities', citiesRouter);

const authenticationRouter = require('./routes/authentication');
app.use('/authentication', authenticationRouter);

const settingsRouter = require('./routes/settings')
app.use('/settings', settingsRouter)

const rentalsRouter = require('./routes/rentals')
app.use('/rentals', rentalsRouter)

const reservationRouter = require('./routes/reservations')
app.use('/reservations', reservationRouter)

const searchRouter = require('./routes/search')
app.use('/search', searchRouter)

const usersRouter = require('./routes/user')
app.use('/user', usersRouter)

app.listen(3000, () => console.log('Server Started'));
