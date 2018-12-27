module.exports = {
  command: 'status-codes [filter]',
  desc: 'list the http status codes',
  builder,
  handler
}

function builder (yargs) {
  yargs
    .positional('filter', {
      type: 'string',
      desc: 'regex filter for matches on the status and message',
      coerce: filter => new RegExp(filter, 'i')
    })
    .option('include-unofficial', {
      type: 'boolean',
      default: false,
      desc: 'include unofficial (non-standard) codes',
      alias: 'u'
    })
    .option('only-unofficial', {
      type: 'boolean',
      default: false,
      desc: 'only show unofficial (non-standard) codes',
      alias: 'U'
    })
}

function handler ({ filter, includeUnofficial, onlyUnofficial }) {
  const c = require('@buzuli/color')
  const h = require('@buzuli/http')

  console.log(`HTTP Status Codes`)

  h.status.codes()
    .filter(({ unofficial }) => {
      return onlyUnofficial ? unofficial : !unofficial || includeUnofficial
    })
    .filter(({ code, description }) => {
      return !filter || `${code}`.match(filter) || description.match(filter)
    })
    .forEach(({ code, unofficial, description }) => {
      console.log(`  ${h.status.color(code)} ${description} ${unofficial ? '❄️ ' : ''}`)
    })

  console.log(`Source: ${c.blue(h.status.codesSource())}`)
}
