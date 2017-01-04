// const generateGetter = require('./generate-getter')

const camelCasifyString = str => {
  let copy = str
  const matches = str.match(/_[a-z]/g)
  if (matches) {
    matches.forEach(match =>
      copy = copy.replace(match, match.charAt(1).toUpperCase())
    )
  }
  return copy
}

const camelCasifyObj = obj => {
  const result = {}
  Object.keys(obj).forEach(key =>
    result[camelCasifyString(key)] = obj[key]
  )
  return result
}

const methodizeStr = str =>
  `get${str.charAt(0).toUpperCase() + camelCasifyString(str.substr(1))}`

const methodizeLinks = (_links, metadata) => {
  const result = {}
  Object.keys(_links).filter(l => l.match('osdi:')).forEach(l =>
    result[methodizeStr(l.split('osdi:')[1])] = () => 'hi'//generateGetter(_links[l].href, metadata)
  )
  return result
}

module.exports = data => {
  const result = {}

  const metadata = {}
  Object.keys(data).filter(k => k != '_links').forEach(k =>
    metadata[k] = data[k]
  )

  const linkMethods = methodizeLinks(data._links, metadata)
  const camelCaseProps = camelCasifyObj(metadata)

  Object.keys(linkMethods).forEach(k => result[k] = linkMethods[k])
  Object.keys(camelCaseProps).forEach(k => result[k] = camelCaseProps[k])

  return result
}
