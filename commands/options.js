const {read: builder} = require('../lib/build')
const {options: handler} = require('../lib/http')

module.exports = {
  command: 'options <url>',
  desc: 'HTTP OPTIONS against a URL',
  builder,
  handler
}
