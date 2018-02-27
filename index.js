const request = require("superagent");
const constructClient = require("./lib/construct-client");

const validateUrl = url =>
  url.match("http:")
    ? new Error("HTTPS required")
    : url.match(/https:.*\..*/) ? null : new Error("Not a valid URL");

module.exports = {
  client: aep =>
    typeof aep == "string"
      ? new Promise((resolve, reject) => {
          const err = validateUrl(aep);
          if (err) return reject(err);

          request
            .get(aep)
            .end(
              (err, res) =>
                err ? reject(err) : resolve(constructClient(res.body))
            );
        })
      : new Promise((resolve, reject) => {
          resolve(constructClient(aep));
        })
};
