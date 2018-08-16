module.exports = {
  command: 'ip',
  desc: 'Fetch public IP info for this caller',
  builder,
  handler
}

function builder (yargs) {
  yargs
    .options('cli', {
      type: 'boolean',
      desc: 'output in a single line for easy CLI use',
      alias: ['c']
    })
    .options('cli-pretty', {
      type: 'boolean',
      desc: 'output in a single line (but with color)',
      alias: ['C']
    })
    .options('json', {
      type: 'boolean',
      desc: 'output in JSON format',
      alias: ['j']
    })
    .options('json-pretty', {
      type: 'boolean',
      desc: 'output pretty JSON (indented and colorized)',
      alias: ['J']
    })
    .options('raw', {
      type: 'boolean',
      desc: 'output the raw JSON output from the Geo API (implies -g)',
      alias: ['r']
    })
    .options('raw-pretty', {
      type: 'boolean',
      desc: 'output pretty version of the raw JSON from the Geo API (implies -g)',
      alias: ['R']
    })
    .options('geo', {
      type: 'boolean',
      desc: 'pull geo IP info also',
      alias: ['g']
    })
}

async function handler ({cli, cliPretty, geo, json, jsonPretty, raw, rawPretty}) {
  const {blue, green, grey, orange, purple, red, yellow, emoji} = require('@buzuli/color')
  const buzJson = require('@buzuli/json')
  const axios = require('axios')

  function colorIt (preferredColor, value) {
    return ((value === 'unknown') ? grey : preferredColor)(value)
  }

  const {url, decode} = ipApi()

  const options = {
    method: 'GET',
    url,
    validateStatus: status => true
  }

  try {
    const {status, data} = await axios(options)

    if (status === 200) {
      const record = decode(data)
      const {
        ip,
        as,
        isp,
        countryCode,
        countryName,
        regionCode,
        regionName,
        city,
        zipCode,
        metroCode,
        timeZone,
        latitude,
        longitude
      } = record

      if (cli) {
        const geoInfo = geo
          ? ` ${countryCode},${regionCode},${zipCode} ${latitude},${longitude}`
          : ''
        console.log(`${ip}${geoInfo}`)
      } else if (cliPretty) {
        const geoInfo = geo
          ? ` ${orange(countryCode)},${yellow(regionCode)},${blue(zipCode)} ${grey(latitude)},${grey(longitude)}`
          : ''
        console.log(`${green(ip)}${geoInfo}`)
      } else if (json || jsonPretty || raw || rawPretty) {
        if (jsonPretty || rawPretty) {
          console.log(buzJson(rawPretty ? data : geo ? record : {ip}))
        } else {
          console.log(JSON.stringify(raw ? data : geo ? record : {ip}))
        }
      } else {
        console.log(`IP Address : ${green(ip)}`)
        if (geo) {
          console.log(`        AS : ${colorIt(yellow, as)}`)
          console.log(`       ISP : ${colorIt(yellow, isp)}`)
          console.log(`   Country : ${colorIt(blue, countryName)} [${colorIt(yellow, countryCode)}]`)
          console.log(`    Region : ${colorIt(blue, regionName)} [${colorIt(yellow, regionCode)}]`)
          console.log(`      City : ${colorIt(blue, city)}`)
          console.log(`  Zip Code : ${colorIt(orange, zipCode)}`)
          console.log(`Metro Code : ${colorIt(orange, metroCode)}`)
          console.log(`  Latitude : ${colorIt(orange, latitude)}`)
          console.log(` Longitude : ${colorIt(orange, longitude)}`)
          console.log(` Time Zone : ${colorIt(purple, timeZone)}`)
        }
      }
    } else {
      console.error(data)
      console.error(emoji.inject(`[${colorCode(status)}] could not determine IP address. Payload above :point_up: `))
      process.exit(1)
    }
  } catch (error) {
    console.error(error)
    console.error(red(emoji.inject(`Error checking IP address. Details above :point_up: `)))
    process.exit(1)
  }

  function colorCode (status) {
    return (status > 499
      ? yellow
      : status > 399
        ? red
        : status > 299
          ? purple
            ? status > 199
            : green
          : blue)(status)
  }
}

// New API
function ipApi () {
  return {
    url: 'http://ip-api.com/json',
    decode: decodeIpApi
  }
}
function decodeIpApi (record) {
  const {
    as,
    city,
    country: countryName,
    countryCode,
    isp,
    lat: latitude,
    lon: longitude,
    org,
    query: ip,
    region: regionCode,
    regionName,
    timezone: timeZone,
    zip: zipCode
  } = record

  return {
    ip,
    as,
    isp,
    org,
    countryCode,
    countryName,
    regionCode,
    regionName,
    city,
    zipCode,
    metroCode: 'unknown',
    timeZone,
    latitude,
    longitude
  }
}
