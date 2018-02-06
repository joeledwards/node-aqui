module.exports = {
  command: 'get <url>',
  desc: 'simple http GET against a URL',
  builder,
  handler: require('../lib/http').get
}

function builder (yargs) {
  yargs
  .option('timeout', {
    type: 'number',
    desc: 'max time (in milliseconds) to wait for a connection',
    default: 5000,
    alias: ['t']
  })
}
