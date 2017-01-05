const resources = require('./resources')
const methodizeLinks = require('./methodize-links')
const parseResponse = require('./parse-response')

const toCase = require('../utils/to-case')

module.exports = data => {
  const result = {}

  const metadata = {}
  for (let k in data) {
    metadata[toCase.camel.str(k)] = data[k]
  }

  const linkMethods = methodizeLinks(data._links, metadata)

  Object.keys(linkMethods).forEach(k => result[k] = linkMethods[k])
  Object.keys(metadata).forEach(k => result[k] = metadata[k])

  result.resources = resources(result)

  result.parse = function (res) {
    const body = {}
    const linkMethods = methodizeLinks(res.body._links)

    for (let k in res.body) {
      if (k != '_embedded') body[toCase.camel.str(k)] = res.body[k]
    }

    Object.assign(body, parseResponse(res.body, result.resources, metadata))
    return body
  }

  return result
}
