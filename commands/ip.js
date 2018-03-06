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
    desc: 'output in a single line for easy CLI use (overrides -j and -J)',
    alias: ['c']
  })
  .options('json', {
    type: 'boolean',
    desc: 'output in JSON format',
    alias: ['j']
  })
  .options('pretty-json', {
    type: 'boolean',
    desc: 'output in nicely indented (human readable) JSON',
    alias: ['J']
  })
  .options('geo', {
    type: 'boolean',
    desc: 'pull geo IP info also',
    default: false,
    alias: ['g']
  })
}

async function handler ({cli, geo, json, prettyJson}) {
  const {blue, green, orange, purple, red, yellow, emoji} = require('@buzuli/color')
  const axios = require('axios')

  const options = {
    method: 'GET',
    url: 'https://freegeoip.net/json',
    validateStatus: status => true
  }

  try {
    const {status, data} = await axios(options)

    if (status === 200) {
      const {
        ip,
        country_code: countryCode,
        country_name: countryName,
        region_code: regionCode,
        region_name: regionName,
        city,
        zip_code: zipCode,
        time_zone: timeZone,
        latitude,
        longitude,
        metro_code: metroCode
      } = data

      if (cli) {
        const geoInfo = geo
          ? ` ${countryCode},${regionCode},${zipCode} ${latitude},${longitude}`
          : ''
        console.log(`${ip}${geoInfo}`)
      } else if (json || prettyJson) {
        const indent = prettyJson ? 2 : null
        console.log(geo ? JSON.stringify(data, null, indent) : JSON.stringify({ip}, null, indent))
      } else {
        console.log(`IP Address : ${green(ip)}`)
        if (geo) {
          console.log(`   Country : ${blue(countryName)} [${yellow(countryCode)}]`)
          console.log(`    Region : ${blue(regionName)} [${yellow(regionCode)}]`)
          console.log(`      City : ${blue(city)}`)
          console.log(`  Zip Code : ${orange(zipCode)}`)
          console.log(`Metro Code : ${orange(metroCode)}`)
          console.log(`  Latitude : ${orange(latitude)}`)
          console.log(` Longitude : ${orange(longitude)}`)
          console.log(` Time Zone : ${purple(timeZone)}`)
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
