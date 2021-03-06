module.exports = {
  build,
  read: build(),
  write: build(writeOptions)
}

function build (next) {
  return yargs => {
    yargs
      .positional('url', {
        type: 'string',
        desc: 'URL of the resource'
      })
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
        desc: 'write raw data to stdout; exit with 0 if 200 status code',
        default: false,
        alias: ['D']
      })
      .option('max-redirects', {
        type: 'number',
        desc: 'maximum number of redirects to follow',
        default: 5,
        alias: ['mr']
      })

    if (next) {
      next(yargs)
    }
  }
}

function writeOptions (yargs) {
  yargs
    .positional('payload', {
      type: 'string',
      desc: 'payload to send'
    })
    .option('payload-from-stdin', {
      type: 'boolean',
      desc: 'read they payload from stdin',
      default: false,
      alias: ['I']
    })
}
