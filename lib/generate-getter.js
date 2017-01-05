const request = require('superagent')

module.exports = (href, metadata) =>
  (options) => {
    const req = request.get(href)

    if (options && options.query) {
      req.query(options.query)
    }

    /*
     * TODO with more options
     */

    return req
  }
