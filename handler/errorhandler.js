
module.exports._401 = (res) => {
    return res.status(401).json({
        message: 'Authentication failed.'
    })
}

module.exports._404 = (res) => {
    return res.status(404).json({ message: '404' })
}

module.exports._409 = (res) => {
    return res.status(409).json({
        message: 'User Exists'
    })
}

module.exports._500 = (err, res) => {
    return res.status(500).json({
        message: err.message
    })
}
