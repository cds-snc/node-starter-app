const repeatSchema = (key, subSchema) => {
  const out = {}

  out[key] = { default: [] }

  Object.keys(subSchema).forEach(function (subKey) {
    out[`${key}.*.${subKey}`] = subSchema[subKey]
  })

  return out
}

module.exports = {
  repeatSchema,
}
