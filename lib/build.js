module.exports = build

function build (next) {
  return yargs => {
    yargs
    .option('header', {
      type: 'array',
      desc: 'customer header to send with request (may specify mulitple)',
      alias: ['h']
    })
    .option('timeout', {
      type: 'number',
      desc: 'max time (in milliseconds) to wait for a connection',
      default: 5000,
      alias: ['t']
    })

    if (next) {
      next(yargs)
    }
  }
}
