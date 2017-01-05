const singularize = require('../utils/singularize')
const methodizeLinks = require('./methodize-links')

module.exports = (raw, resources, metadata) => {
  const result = {}

  for (let key in raw._embedded) {
    if (key.match('osdi:')) {
      const type = key.split('osdi:')[1]
      result[type] = raw._embedded[key].map(obj =>
        new resources[singularize(type)](obj)
      )
    }
  }

  const paginationLinks = {}
  for (let l in raw._links) {
    if (l.match(':') == null)
      paginationLinks[l] = raw._links[l]
  }

  const getters = methodizeLinks(paginationLinks, metadata)
  Object.keys(getters).forEach(m => result[m] = getters[m])

  return result
}
