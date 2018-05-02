module.exports = {
  del,
  get,
  head,
  options,
  query,
  post,
  put
}

function del (options) {
  query({method: 'DELETE', ...options})
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

function post (options) {
  query({method: 'POST', ...options})
}

function put (options) {
  query({method: 'PUT', ...options})
}

function query ({
  method,
  timeout,
  url,
  username,
  password,
  allowInvalidCerts,
  onlyOutputData,
  payload,
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
  const hexdump = require('@buzuli/hexdump')

  const {split: splitHeader} = require('./header')

  const headers = r.compose(
    r.mergeAll,
    r.map(splitHeader)
  )(header)

  const containsHeader = (name, headers) => r.compose(
    r.filter(key => key === r.toLower(name)),
    r.map(r.toLower),
    r.keys
  )(headers).length > 0

  let payloadIsJson = false
  let jsonData
  let readStdin = false
  if (payload) {
    if (payload === '-') {
      readStdin = true
    } else {
      try {
        jsonData = JSON.parse(payload)
        payloadIsJson = true
      } catch (err) {
        /* Just Checking */
      }
    }

    if (!containsHeader('Content-Type', headers)) {
      headers['Content-Type'] = payloadIsJson ? 'application/json' : 'application:octet-stream'
    }
  }

  if (!containsHeader('User-Agent', headers)) {
    headers['User-Agent'] = `aqui/${version}`
  }

  const options = {
    method,
    url,
    headers,
    timeout,
    httpsAgent,
    auth,
    data: readStdin ? process.stdin : payload,
    validateStatus: status => true,
    responseType: onlyOutputData ? 'stream' : undefined
  }

  const watch = stopwatch().start()

  require('axios')(options)
    .then(res => {
      watch.stop()

      const {data, headers, status, statusText} = res
      const [codeColored, textColored] = colorCode(status, statusText)

      if (data) {
        // Response Data
        if (onlyOutputData) {
          data.pipe(process.stdout)
          data.on('end', () => process.exit(status === 200 ? 0 : 1))
        } else {
          if ((headers['content-type'] || '').match(/\/json/)) {
            console.log(buzJson(data))
          } else if ((typeof data === 'object') && !(data instanceof Buffer)) {
            console.log(buzJson(data))
          } else {
            console.log(data)
          }

          console.log()
        }
      }

      if (!onlyOutputData) {
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

        // Request Payload
        if (payload && payload !== '-') {
        // TODO: report how many bytes were forwarded when reading from stdin
          console.log()
          if (payloadIsJson) {
            console.log(buzJson(jsonData))
          } else {
            console.log(hexdump(Buffer.from(payload)))
          }
        }

        // Request Headers
        console.log()

        const requestHeaders = r.compose(
          r.mergeAll,
          r.map(splitHeader),
          r.tail,
          r.filter(r.complement(r.equals(''))),
          r.map(r.trim)
        )(r.split('\n')(res.request._header))

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
