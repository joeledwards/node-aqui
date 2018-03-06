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
  const {version} = require('../package.json')
  const r = require('ramda')
  const {stopwatch} = require('durations')

  const {split: splitHeader} = require('./header')

  const headers = r.compose(
    r.mergeAll,
    r.map(splitHeader)
  )(header)

  if (!headers['user-agent']) {
    headers['user-agent'] = `aqui/${version}`
  }

  const options = {
    method,
    url,
    headers,
    timeout,
    httpsAgent,
    auth,
    validateStatus: status => true
  }

  const watch = stopwatch().start()

  require('axios')(options)
  .then(resp => {
    watch.stop()

    const {data, headers, status, statusText} = resp
    const [codeColored, textColored] = colorCode(status, statusText)

    if (data) {
      if ((headers['content-type'] || '').match(/\/json/)) {
        console.log(JSON.stringify(data, null, 2))
      } else {
        console.log(data)
      }
      console.log()
    }

    const maxHeaderLength = r.compose(r.reduce(r.max, 0), r.map(h => h.length), r.keys)(headers)
    r.compose(r.sortBy(([k, v]) => k), r.toPairs)(headers)
      .forEach(([name, value]) => {
        const pad = ' '.repeat(maxHeaderLength - name.length)
        console.log(`${pad}${yellow(name)} : ${blue(value)}`)
      })

    console.log()
    console.log(`${orange(method)} ${green(url)}`)

    console.log()
    console.log(`[${codeColored}] ${textColored} (${orange(watch)})`)
  })
  .catch(error => {
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
