const {write: builder} = require('../lib/build')
const {post: handler} = require('../lib/http')

module.exports = {
  command: 'post <url> [payload]',
  desc: 'HTTP POST against a URL',
  builder,
  handler
}
