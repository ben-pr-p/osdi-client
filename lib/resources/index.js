const resourceify = require("./resourceify");
const singularize = require("../../utils/singularize");

const commonFields = ["identifiers", "created_date", "modified_date"];

const resources = {
  Person: ["familyName", "givenName"],
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
  PersonSignupHelper: [],
  Wrapper: [],
  Message: [],
  AdvocacyCampaign: []
  // TODO - populate
};

for (let key in resources) {
  resources[key] = resources[key].concat(commonFields);
}

module.exports = client => {
  const exports = {};
  for (let key in client._links) {
    if (key.match("osdi:")) {
      const resourceType = key.split("osdi:")[1];
      const name = singularize(resourceType);
      exports[name] = resourceify(
        name,
        resources[name],
        client._links[key].href
      );
    }
  }
  return exports;
};
