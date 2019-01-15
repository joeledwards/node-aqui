const { write: builder } = require('../lib/build')
const { del: handler } = require('../lib/http')

module.exports = {
  command: 'delete <url> [payload]',
  desc: 'HTTP DELETE against a URL',
  builder,
  handler
}
