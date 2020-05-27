const jwt = require('jsonwebtoken')
// Safe routes --> settings, reservations,...
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        console.log(token)
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY)
        req.userData = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication failed.'
        })
    }
}