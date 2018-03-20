# aquí

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

Simple CLI HTTP tools aimed at maximum human friendliness.

## Installation

```shell
$ npm i -g aqui
```

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
    "User-Agent": "aqui/1.10.1"
  },
  "origin": "152.234.163.335",
  "url": "http://httpbin.org/get?agent=aqui"
}

access-control-allow-credentials : true
     access-control-allow-origin : *
                      connection : close
                  content-length : 299
                    content-type : application/json
                            date : Tue, 20 Mar 2018 22:27:24 GMT
                          server : meinheld/0.6.1
                             via : 1.1 vegur
                    x-powered-by : Flask
                x-processed-time : 0

GET http://httpbin.org/get?agent=aqui

    Accept : application/json, text/plain, */*
Connection : close
      Host : httpbin.org
User-Agent : aqui/1.10.1
    bearer : none

[200] OK (295.778 ms)
```

Geo IP query

```shell
$ aqui ip -gJ
{
  "ip": "152.234.163.335",
  "country_code": "US",
  "country_name": "United States",
  "region_code": "OR",
  "region_name": "Oregon",
  "city": "Boardman",
  "zip_code": "97818",
  "time_zone": "America/Los_Angeles",
  "latitude": 45.7788,
  "longitude": -119.529,
  "metro_code": 810
}
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
