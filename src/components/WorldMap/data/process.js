const fs = require('fs')


// ..\node_modules\.bin\topojson.cmd -o timezone-topo.json --simplify=0.00001 -q 1e4  --id-property=tzid .\combined-with-oceans.json
// https://github.com/evansiroky/timezone-boundary-builder
const topo = JSON.parse(fs.readFileSync('timezone-topo.json', 'utf8'))

// https://github.com/moment/moment-timezone/pull/410/
const tzidToCountry = JSON.parse(fs.readFileSync('moment-tz-with-countries.json', 'utf8'))

topo.objects.timezones = Object.values(topo.objects)[0]
delete topo.objects[Object.keys(topo.objects)[0]]

console.log('how many tz?', topo.objects.timezones.geometries.length)

const tzidToCountryManual = tzid => ({
  'Africa/Kinshasa': 'CD',
  'Africa/Lubumbashi': 'CD',
  'Africa/Niamey': 'NE',
  'Africa/Luanda': 'AO',
  'Africa/Bamako': 'ML',
  'Africa/Addis_Ababa': 'ET',
  'Africa/Nouakchott': 'MR',
  'Africa/Dar_es_Salaam': 'TZ',
  'Africa/Lusaka': 'ZM',
  'Africa/Mogadishu': 'SO',
  'Africa/Bangui': 'CF',
  'Africa/Gaborone': 'BW',
  'Africa/Douala': 'CM',
  'Africa/Harare': 'ZW',
  'Africa/Brazzaville': 'CG',
  'Africa/Muscat': 'OM',
  'Africa/Ouagadougou': 'BF',
  'Africa/Libreville': 'GA',
  'Africa/Conakry': 'GN',
  'Africa/Kampala': 'UG',
  'Africa/Dakar': 'SN',
  'Africa/Blantyre': 'MW',
  'Africa/Asmara': 'ER',
  'Africa/Porto-Novoa': 'BJ',

  'Indian/Antananarivo': 'MG',

  'Europe/Bratislava': 'SK',
  'Europe/Zagreb': 'HR',
  'Europe/Ljubljana': 'SI',

  'Asia/Aden': 'YE',
  'Asia/Vientiane': 'LA',
  'Asia/Phnom_Penh': 'KH',
  'Asia/Kuwait': 'KW',
  'Asia/Bahrain': 'BH',
})[tzid] || tzid


topo.objects.timezones.geometries.forEach(geometry => {
  let country = geometry.id

  const zoneInfo = tzidToCountry.zones.find(z => z.name === geometry.id)
  if (zoneInfo && zoneInfo.countries.length > 0) {
    country = zoneInfo.countries[0]
  } else {
    country = tzidToCountryManual(geometry.id)
  }


  geometry.properties = {
    country,
    isOcean: geometry.id.startsWith('Etc/GMT')
  }
})


fs.writeFileSync('timezones.js', `const data = ${JSON.stringify(topo)}\n\nexport default data`)
