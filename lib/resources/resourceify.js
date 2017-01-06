const request = require('superagent')
const toCase = require('../../utils/to-case')

module.exports = (resourceName, properties, endpoint) => {
  const Resource = function (data) {
    this._links = data._links
    this.data = toCase.camel.obj(Object.assign(data, {_links: undefined}))
    this._updatedFields = []

    if (!this.data.identifiers)
      this.data.identifiers = []
  }

  /*
   * Create getter setters for each property
   */
  properties.forEach(prop =>
    Resource.prototype[prop] = function (_) {
      if (typeof _ == 'undefined')
        return this.data[prop]

      this.data[prop] = _
      this._updatedFields.push(prop)
      return this
    }
  )

  Resource.prototype.save = function () {
    // If we're new
    if (this.data.identifiers.length == 0) {
      return request.post(endpoint)
        .send(this.data)
    }

    // Otherwise we must have a self in _links
    else {
      const putBody = {}
      this._updatedFields.forEach(prop =>
        putBody[toCase.snake.str(prop)] = this[prop]()
      )

      return request.put(this._links.self.href)
        .send(putBody)
    }
  }

  Resource.prototype.delete = function () {
    return request.delete(this._links.self.href)
  }

  return Resource
}
