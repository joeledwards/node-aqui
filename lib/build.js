module.exports = build

function build (next) {
  return yargs => {
    yargs
    .option('header', {
      type: 'array',
      desc: 'customer request header (may specify mulitple)',
      alias: ['h']
    })
    .option('timeout', {
      type: 'number',
      desc: 'max time (in milliseconds) to wait the request to complete',
      default: 5000,
      alias: ['t']
    })
    .option('allow-invalid-certs', {
      type: 'boolean',
      desc: 'perform the request even if the cert is self-signed or invalid',
      default: false,
      alias: ['C']
    })

    if (next) {
      next(yargs)
    }
  }
}
