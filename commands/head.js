const { read: builder } = require('../lib/build')
const { head: handler } = require('../lib/http')

module.exports = {
  command: 'head <url>',
  desc: 'HTTP HEAD against a URL',
  builder,
  handler
}
