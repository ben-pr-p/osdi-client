const toCase = require('../utils/to-case')
const generateGetter = require('./generate-getter')

module.exports = (_links, metadata) => {
  const result = {}
  for (let l in _links) {
    if (l.match('osdi:')) {
      const resourceName = l.split('osdi:')[1]
      result[toCase.method.str(resourceName)] = generateGetter(_links[l].href, metadata)
    }

    if (l == 'next' || l == 'prev') {
      result[l + 'Page'] = generateGetter(_links[l].href, metadata)
    }
  }
  return result
}
