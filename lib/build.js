module.exports = build

function build (next) {
  return yargs => {
    yargs
      .option('header', {
        type: 'array',
        desc: 'custom request header (may specify mulitple)',
        alias: ['h']
      })
      .option('timeout', {
        type: 'number',
        desc: 'max time (in milliseconds) to wait the request to complete',
        default: 5000,
        alias: ['t']
      })
      .option('username', {
        type: 'string',
        desc: 'basic auth username',
        alias: ['u']
      })
      .option('password', {
        type: 'string',
        desc: 'basic auth password',
        alias: ['p']
      })
      .option('allow-invalid-certs', {
        type: 'boolean',
        desc: 'perform the request even if the cert is self-signed or invalid',
        default: false,
        alias: ['C']
      })
      .option('only-output-data', {
        type: 'boolean',
        desc: 'output the data by itself if the request succeeded',
        default: false,
        alias: ['D']
      })

    if (next) {
      next(yargs)
    }
  }
}
