const { write: builder } = require('../lib/build')
const { patch: handler } = require('../lib/http')

module.exports = {
  command: 'patch <url> [payload]',
  desc: 'HTTP PATCH against a URL',
  builder,
  handler
}
