const builder = require('../lib/build')()
const {head: handler} = require('../lib/http')

module.exports = {
  command: 'head <url>',
  desc: 'simple http HEAD against a URL',
  builder,
  handler
}
