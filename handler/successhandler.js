
module.exports._200 = (res) => {
    return res.status(200).json({
        message: 'success'
    })
}

module.exports._201 = (res) => {
    return res.status(201).json({
        message: 'success'
    })
}
