const fs = require('fs');

// Read the input file, originally sourced from https://michaelminn.net/tutorials/data/#acs 2019-2023-acs-tracts.json, then passed through a simplifier using mapshaper: https://mapshaper.org/
const geojson = JSON.parse(fs.readFileSync('2019-2023-acs-tracts-simplified.json', 'utf8'));

// Strip down properties
geojson.features = geojson.features.map(feature => {
  feature.properties = {
    p: feature.properties.Total_Population,
    pd: feature.properties.Pop_per_Square_Mile
  };
  return feature;
});

// Write the stripped GeoJSON
fs.writeFileSync('2019-2023-acs-tracts-simplified-stripped.json', JSON.stringify(geojson));

console.log(`Stripped properties from ${geojson.features.length} features`);