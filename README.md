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
    "User-Agent": "aqui/2.0.1"
  },
  "origin": "71.39.37.51",
  "url": "http://httpbin.org/get?agent=aqui"
}

access-control-allow-credentials : true
     access-control-allow-origin : *
                      connection : close
                  content-length : 298
                    content-type : application/json
                            date : Mon, 30 Apr 2018 16:44:03 GMT
                          server : nginx/1.14.0 (Ubuntu)
                    x-powered-by : Flask
                x-processed-time : 0

GET http://httpbin.org/get?agent=aqui

    Accept : application/json, text/plain, */*
Connection : close
      Host : httpbin.org
User-Agent : aqui/2.0.1
    bearer : none

[200] OK (189.984 ms)
```

Geo IP query

```shell
$ aqui ip -gJ
{
  "ip": "71.39.37.51",
  "as": "AS209 Qwest Communications Company, LLC",
  "isp": "CenturyLink",
  "org": "CenturyLink",
  "countryCode": "US",
  "countryName": "United States",
  "regionCode": "NM",
  "regionName": "New Mexico",
  "city": "Albuquerque",
  "zipCode": "87110",
  "metroCode": "unknown",
  "timeZone": "America/Denver",
  "latitude": 35.1091,
  "longitude": -106.5807
}
```

## Usage
```
$ aqui --help
aqui <command>

Commands:
  aqui delete <url> [payload]  HTTP DELETE against a URL
  aqui get <url>               HTTP GET against a URL
  aqui head <url>              HTTP HEAD against a URL
  aqui ip                      Fetch public IP info for this caller
  aqui options <url>           HTTP OPTIONS against a URL
  aqui post <url> [payload]    HTTP POST against a URL
  aqui put <url> [payload]     HTTP PUT against a URL

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]

```

[travis-url]: https://travis-ci.org/joeledwards/node-aqui
[travis-image]: https://img.shields.io/travis/joeledwards/node-aqui/master.svg
[npm-url]: https://www.npmjs.com/package/aqui
[npm-image]: https://img.shields.io/npm/v/aqui.svg
