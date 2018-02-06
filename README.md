# aquí

Simple CLI HTTP client aimed at maximum human friendliness.

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
    "User-Agent": "axios/0.17.1"
  },
  "origin": "71.39.37.51",
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
