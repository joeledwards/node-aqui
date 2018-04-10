const builder = require('../lib/build')()
const {put: handler} = require('../lib/http')

module.exports = {
  command: 'put <url> [payload]',
  desc: 'HTTP PUT against a URL',
  builder,
  handler
}
