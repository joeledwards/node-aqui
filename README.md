# aquí

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

Simple CLI HTTP tools aimed at maximum human friendliness.

## Installation

```shell
$ npm i -g aqui
```

## Configuration

Uses `@buzuli/color`, so its [configuration options](https://www.npmjs.com/package/@buzuli/color#configuration) can be applied to optimize for your terminal.

## Examples

HTTP GET requet
 
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
    "User-Agent": "aqui/3.0.2"
  },
  "origin": "52.34.191.12",
  "url": "http://httpbin.org/get?agent=aqui"
}

access-control-allow-credentials : true
     access-control-allow-origin : *
                      connection : close
                  content-length : 233
                    content-type : application/json
                            date : Tue, 15 May 2018 13:18:38 GMT
                          server : gunicorn/19.8.1
                             via : 1.1 vegur

GET http://httpbin.org/get?agent=aqui

    Accept : application/json, text/plain, */*
Connection : close
      Host : httpbin.org
User-Agent : aqui/3.0.3
    bearer : none

[200] OK (597.562 ms)
```

Geo IP query

```shell
$ aqui ip -gJ
{
  "ip": "52.34.191.12",
  "as": "AS16509 Amazon.com, Inc.",
  "isp": "Amazon.com",
  "org": "Amazon.com",
  "countryCode": "US",
  "countryName": "United States",
  "regionCode": "OR",
  "regionName": "Oregon",
  "city": "Boardman",
  "zipCode": "97818",
  "metroCode": "unknown",
  "timeZone": "America/Los_Angeles",
  "latitude": 45.8696,
  "longitude": -119.688
}
```

## Usage
```
$ aqui <command>

Commands:
  aqui delete <url> [payload]  HTTP DELETE against a URL
  aqui get <url>               HTTP GET against a URL
  aqui head <url>              HTTP HEAD against a URL
  aqui ip                      Fetch public IP info for this caller
  aqui options <url>           HTTP OPTIONS against a URL
  aqui patch <url> [payload]   HTTP PATCH against a URL
  aqui post <url> [payload]    HTTP POST against a URL
  aqui put <url> [payload]     HTTP PUT against a URL
  aqui status-codes [filter]   list the http status codes

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

[travis-url]: https://travis-ci.org/joeledwards/node-aqui
[travis-image]: https://img.shields.io/travis/joeledwards/node-aqui/master.svg
[npm-url]: https://www.npmjs.com/package/aqui
[npm-image]: https://img.shields.io/npm/v/aqui.svg
