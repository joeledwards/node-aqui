# aquí

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

Simple CLI HTTP tools aimed at maximum human friendliness.

## Installation

```shell
$ npm i -g aqui
```

## Example

```shell
$ aqui get http://httpbin.org/get?agent=aqui -h bearer:none
{
  "args": {
    "agent": "aqui"
  },
  "headers": {
    "Accept": "application/json, text/plain, */*",
    "Bearer": "none",
    "Connection": "close",
    "Host": "httpbin.org",
    "User-Agent": "aqui/1.4.0"
  },
  "url": "http://httpbin.org/get?agent=aqui"
}

access-control-allow-credentials : true
     access-control-allow-origin : *
                      connection : close
                  content-length : 300
                    content-type : application/json
                            date : Tue, 06 Feb 2018 07:06:23 GMT
                          server : meinheld/0.6.1
                             via : 1.1 vegur
                    x-powered-by : Flask
                x-processed-time : 0.000999927520752

GET http://httpbin.org/get?agent=aqui

[200] OK (199.412 ms)
```

## Usage
```
$ aqui --help
aqui <command>

Commands:
  aqui get <url>      simple http GET against a URL
  aqui head <url>     simple http HEAD against a URL
  aqui ip             Fetch public IP info for this caller
  aqui options <url>  simple http OPTIONS against a URL

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]

```

[travis-url]: https://travis-ci.org/joeledwards/node-aqui
[travis-image]: https://img.shields.io/travis/joeledwards/node-aqui/master.svg
[npm-url]: https://www.npmjs.com/package/aqui
[npm-image]: https://img.shields.io/npm/v/aqui.svg
