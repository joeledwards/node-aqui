const builder = require('../lib/build')()
const {get: handler} = require('../lib/http')

module.exports = {
  command: 'get <url>',
  desc: 'simple http GET against a URL',
  builder,
  handler
}
