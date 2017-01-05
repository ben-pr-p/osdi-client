const title = str =>
  (str.match(/_[a-z]/g) || []).reduce((acc, curr, _, arr) =>
    acc.replace(curr, curr.charAt(1).toUpperCase())
  , str.charAt(0).toUpperCase() + str.substr(1))

const stringModifiers = {
  camel: str =>
    (str.match(/._[a-z]/g) || []).reduce((acc, curr) =>
      acc.replace(curr, curr.charAt(0) + curr.charAt(2).toUpperCase())
    , str),
  title: title,
  method: str =>
    'get' + title(str)

}

const toCaseObj = stringFn => obj => {
  if (typeof obj != 'object')
    return obj

  const result = {}
  for (let key in obj)
    result[stringFn(key)] = toCaseObj(obj[key])

  return result
}

module.exports = {
  camel: {
    str: stringModifiers.camel,
    obj: toCaseObj(stringModifiers.camel)
  },
  method: {
    str: stringModifiers.method,
    obj: toCaseObj(stringModifiers.method)
  },
  title: {
    str: stringModifiers.title,
    obj: toCaseObj(stringModifiers.title)
  }
}
