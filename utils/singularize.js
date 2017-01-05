const toCase = require('./to-case')

const resources = {
  Person: ['family_name', 'given_name'],
  Petition: [],
  Event: [],
  Form: [],
  FundraisingPage: [],
  Donation: [],
  Tag: [],
  List: [],
  Query: [],
  Question: [],
  SharePage: [],
  PersonSignupHelper: []
  // TODO - populate
}

module.exports = resourceType => {
  const singular = {
    people: 'Person',
    queries: 'Query',
  }[resourceType]

  if (singular) return singular

  if (resourceType.match(/s$/))
    return toCase.title.str(resourceType.substr(0, resourceType.length - 1))

  return toCase.title.str(resourceType)
}
