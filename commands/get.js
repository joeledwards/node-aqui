const { read: builder } = require('../lib/build')
const { get: handler } = require('../lib/http')

module.exports = {
  command: 'get <url>',
  desc: 'HTTP GET against a URL',
  builder,
  handler
}
