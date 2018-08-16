const c = require('@buzuli/color')
const urlParser = require('url')
const queryParser = require('querystring')

module.exports = formatUrl

function formatUrl (url) {
  const {
    protocol,
    hostname: host,
    port,
    pathname: path,
    query
  } = urlParser.parse(url)

  const proto = protocol.replace(':', '')
  const protoStr = (proto === 'https' ? c.green(proto) : proto)
  const hostStr = c.blue(host)
  const portStr = port ? `:${c.orange(port)}` : ''
  const pathStr = path ? formatPath(path) : ''
  const queryStr = query ? formatQuery(query) : ''

  return `${protoStr}://${hostStr}${portStr}${pathStr}${queryStr}`
}

function formatPath (path) {
  return path
    .split('/')
    .map(pc => c.purple(pc))
    .join('/')
}

function formatQuery (query) {
  const parts = Object.entries(queryParser.parse(query))
  if (parts.length > 0) {
    return c.grey('?' + parts.map(([k, v]) => {
      return `${c.yellow(k)}=${c.green(v)}`
    }).join('&'))
  } else {
    return ''
  }
}
