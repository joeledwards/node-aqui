module.exports = {
  split
}

const r = require('ramda')

function split (header) {
  if (!header) return
  if (typeof header !== 'string') return

  const pivot = header.indexOf(':')

  if (pivot < 1) return

  const name = r.trim(header.substr(0, pivot))

  if (name.length < 1) return
  if (pivot + 1 > header.length) return

  const value = r.trim(header.substr(pivot + 1))

  if (value.length < 1) return

  const pair = {}
  pair[name] = value

  return pair
}
