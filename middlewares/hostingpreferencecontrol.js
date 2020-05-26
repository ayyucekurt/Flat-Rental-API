const errorHandler = require('../handler/errorhandler')
const User = require('../model/user');

module.exports = (req, res, next) => {
    try {
        User.findOne({ email: req.body.email }, { isHostActivated: 1 })
            .exec()
            .then(hostingPreference => {
                if (hostingPreference.isHostActivated === true) {
                    return next()
                }
                return errorHandler._401(res)
            })
            .catch(err => {
                return errorHandler._500(err, res)
            })
    } catch (err) {
        return errorHandler._500(err, res)
    }
}

