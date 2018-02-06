# aquí

Simple CLI HTTP client aimed at maximum human friendliness.

## Installation

You can either perform a global install of aqui, or use npx to run it.

Install:
```shell
$ npm i -g aqui
```

Run via npx:
```shell
$ npx aqui get http://httpbin.org/status/200
access-control-allow-credentials : true
     access-control-allow-origin : *
                      connection : close
                  content-length : 0
                    content-type : text/html; charset=utf-8
                            date : Tue, 06 Feb 2018 04:02:09 GMT
                          server : meinheld/0.6.1
                             via : 1.1 vegur
                    x-powered-by : Flask
                x-processed-time : 0.000792026519775

GET http://httpbin.org/status/200

[200] OK
```
