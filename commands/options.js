const builder = require('../lib/build')()
const {options: handler} = require('../lib/http')

module.exports = {
  command: 'options <url>',
  desc: 'simple http OPTIONS against a URL',
  builder,
  handler
}
