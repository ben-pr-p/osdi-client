const toCase = require('../../utils/to-case')

module.exports = (resourceName, properties, osdi) => {
  const name = function (data) {
    Object.assign(this, data)
    this.updatedFields = []

    if (!this.identifiers)
      this.identifiers = []
  }

  /*
   * Create getter setters for each property
   */
  properties.forEach(prop =>
    name.prototype[prop] = function (_) {
      if (typeof _ == 'undefined')
        return this[prop]

      this[prop] = _
      this.updatedFields.push(prop)
      return this
    }
  )

  name.prototype.save = function () {
    // If we're new
    if (this.updatedFields.length == 0) {

    }

    // Otherwise we must have a self in _links
    else {
      const putBody = {}
      this.updatedFields.forEach(prop =>
        putBody[prop] = this[prop]
      )
      // TODO - figure out a way to pass to endpoint here
    }
  }

  name.prototype.delete = function () {
    // TODO - figure out a way to pass to endpoint here
  }

  return name
}
