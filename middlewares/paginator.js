
module.exports = (allResults, req, res) => {
    const page = parseInt(req.body.page)
    const limit = parseInt(req.body.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < allResults.length) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }

    results.results = allResults.slice(startIndex, limit)
    return res.status(200).json({ message: 'success', results })
}
