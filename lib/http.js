module.exports = {
  get,
  head,
  options,
  query
}

function get (options) {
  query({method: 'GET', ...options})
}

function head (options) {
  query({method: 'HEAD', ...options})
}

function options (options) {
  query({method: 'OPTIONS', ...options})
}

function query ({
  method,
  timeout,
  url,
  username,
  password,
  allowInvalidCerts,
  onlyOutputData,
  header = []
}) {
  let httpsAgent
  if (allowInvalidCerts) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    const {Agent} = require('https')
    httpsAgent = new Agent({rejectUnauthorized: false})
  }

  let auth = (username || password) ? {username, password} : undefined

  const {
    blue, green, orange, purple, red, yellow
  } = require('@buzuli/color')
  const buzJson = require('@buzuli/json')
  const {version} = require('../package.json')
  const r = require('ramda')
  const {stopwatch} = require('durations')

  const {split: splitHeader} = require('./header')

  const headers = r.compose(
    r.mergeAll,
    r.map(splitHeader)
  )(header)

  if (!headers['User-Agent']) {
    headers['User-Agent'] = `aqui/${version}`
  }

  let requestHeaders = {}
  const options = {
    method,
    url,
    headers,
    timeout,
    httpsAgent,
    auth,
    validateStatus: status => true,
    transformRequest: (data, headers) => {
      // Collect the headers which will be sent to the
      const methodHeaders = headers[r.toLower(method)] || {}
      const commonHeaders = headers.common || {}
      const otherHeaders = r.compose(
        r.fromPairs,
        r.filter(
          r.complement((pair) => [
            'common', 'delete', 'get', 'head', 'post', 'put', 'patch'
          ].includes(pair[0]))
        ),
        r.toPairs
      )(headers)
      requestHeaders = {...methodHeaders, ...commonHeaders, ...otherHeaders}
    }
  }

  const watch = stopwatch().start()

  require('axios')(options)
  .then(resp => {
    watch.stop()

    const {data, headers, status, statusText} = resp
    const [codeColored, textColored] = colorCode(status, statusText)

    if (data) {
      // Response Data
      if ((headers['content-type'] || '').match(/\/json/)) {
        console.log(buzJson(data))
      } else {
        console.log(data)
      }
      console.log()
    }

    if (onlyOutputData) {
      process.exit(status === 200 ? 0 : 1)
    } else {
      // Response Headers
      const maxResponseHeaderLength = r.compose(
        r.reduce(r.max, 0),
        r.map(h => h.length),
        r.keys
      )(headers)

      r.compose(
        r.sortBy(([k, v]) => k),
        r.toPairs
      )(headers)
      .forEach(([name, value]) => {
        const pad = ' '.repeat(maxResponseHeaderLength - name.length)
        console.log(`${pad}${yellow(name)} : ${blue(value)}`)
      })

      // Method and URL
      console.log()
      console.log(`${orange(method)} ${green(url)}`)

      // Request Headers
      console.log()

      const maxRequestHeaderLength = r.compose(
        r.reduce(r.max, 0),
        r.map(h => h.length),
        r.keys
      )(requestHeaders)

      r.compose(
        r.sortBy(([k, v]) => k),
        r.toPairs
      )(requestHeaders)
      .forEach(([name, value]) => {
        const pad = ' '.repeat(maxRequestHeaderLength - name.length)
        console.log(`${pad}${yellow(name)} : ${blue(value)}`)
      })

      // Status and Duration
      console.log()
      console.log(`[${codeColored}] ${textColored} (${orange(watch)})`)
    }
  })
  .catch(error => {
    console.error(error)
    console.error(`${orange(method)} ${green(url)}: ${red(error)}`)
    process.exit(1)
  })

  function colorCode (status, message) {
    const color = (status > 499
      ? yellow
      : status > 399
      ? red
      : status > 299
      ? purple
      : status > 199
      ? green
      : blue
    )

    return message
      ? [color(status), color(message)]
      : color(status)
  }
}
