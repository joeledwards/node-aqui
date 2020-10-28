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
  query({ method: 'DELETE', ...options })
}

function get (options) {
  query({ method: 'GET', ...options })
}

function head (options) {
  query({ method: 'HEAD', ...options })
}

function options (options) {
  query({ method: 'OPTIONS', ...options })
}

function post (options) {
  query({ method: 'POST', ...options })
}

function put (options) {
  query({ method: 'PUT', ...options })
}

function query ({
  method,
  timeout,
  url: requestUrl,
  username,
  password,
  allowInvalidCerts,
  onlyOutputData,
  payload,
  payloadFromStdin,
  header = [],
  maxRedirects
}) {
  let httpsAgent

  if (allowInvalidCerts) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    const { Agent } = require('https')
    httpsAgent = new Agent({ rejectUnauthorized: false })
  }

  const auth = (username || password) ? { username, password } : undefined

  // Only require modules if we have valid options
  const c = require('@buzuli/color')
  const h = require('@buzuli/http')
  const buzJson = require('@buzuli/json')
  const { version } = require('../package.json')
  const r = require('ramda')
  const { stopwatch } = require('durations')
  const hexdump = require('@buzuli/hexdump')

  const { split: splitHeader } = require('./header')

  // Prepare the user-supplied headers
  const headers = r.compose(
    r.mergeAll,
    r.map(splitHeader)
  )(header)

  // Header search function
  const containsHeader = (name, headers) => r.compose(
    r.filter(key => key === r.toLower(name)),
    r.map(r.toLower),
    r.keys
  )(headers).length > 0

  // Handle payload if included
  let payloadIsJson = false
  let jsonData
  if (!payloadFromStdin && payload) {
    // Only JSON is auto-detected
    try {
      jsonData = JSON.parse(payload)
      payloadIsJson = true
    } catch (err) {
      /* Just Checking */
    }

    // Set the a Content-Type of none was supplied by the user
    if (!containsHeader('Content-Type', headers)) {
      headers['Content-Type'] = payloadIsJson ? 'application/json' : 'application/octet-stream'
    }
  }

  // Set the user agent if none was supplied by the user
  if (!containsHeader('User-Agent', headers)) {
    headers['User-Agent'] = `aqui/${version}`
  }

  const url = h.url.coerce(requestUrl).href

  // Configuration options for axios
  const options = {
    method,
    url,
    headers,
    timeout,
    httpsAgent,
    auth,
    data: (payloadFromStdin ? process.stdin : payload) || '',
    validateStatus: status => true,
    responseType: onlyOutputData ? 'stream' : undefined,
    maxRedirects
  }

  // Measure the duration of the request
  const watch = stopwatch().start()

  // Run it
  require('axios')(options)
    .then(res => {
      watch.stop()

      const { data, headers: responseHeaders, status, statusText } = res
      let statusDescription = statusText
      if (!statusText || statusText === 'unknown') {
        statusDescription = h.status.codeInfo(status).description
      }
      const [codeColored, textColored] = h.status.color(status, statusDescription)

      if (data) {
        // Response Data
        if (onlyOutputData) {
          data.pipe(process.stdout)
          data.on('end', () => process.exit(status === 200 ? 0 : 1))
          process.stdout.on('error', error => {
            if (error.code !== 'EPIPE') {
              console.error(`Error writing to stdout : ${error}`)
              process.exit(1)
            }
          })
        } else {
          if ((responseHeaders['content-type'] || '').match(/\/json/)) {
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
        formatHeaders(responseHeaders).forEach(header => console.log(header))

        // Method and URL
        console.log()
        console.log(`${c.orange(method)} ${h.url.color(url)}`)

        // Request Payload
        if (!payloadFromStdin && payload) {
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

        const requestHeaders = extractRequestHeaders(res.request)
        formatHeaders(requestHeaders).forEach(header => console.log(header))

        // Status and Duration
        console.log()
        console.log(`[${codeColored}] ${textColored} (${c.orange(watch)})`)
      }
    })
    .catch(error => {
      console.error(error)
      console.error(`${c.orange(method)} ${c.green(url)}: ${c.red(error)}`)
      process.exit(1)
    })

  function extractRequestHeaders (request) {
    return r.compose(
      r.mergeAll,
      r.map(splitHeader),
      r.tail,
      r.filter(r.complement(r.equals(''))),
      r.map(r.trim)
    )(r.split('\n')(request._header))
  }

  function formatHeaders (headers) {
    const maxHeaderLength = r.compose(
      r.reduce(r.max, 0),
      r.map(h => h.length),
      r.keys
    )(headers)

    return r.compose(
      r.map(([name, value]) => {
        const pad = ' '.repeat(maxHeaderLength - name.length)
        return `${pad}${c.yellow(name)} : ${c.blue(value)}`
      }),
      r.sortBy(([k, v]) => k),
      r.toPairs
    )(headers)
  }
}
