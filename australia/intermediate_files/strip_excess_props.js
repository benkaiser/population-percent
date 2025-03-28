const fs = require('fs');

// Read the input file
const geojson = JSON.parse(fs.readFileSync('sa2_with_population.geojson', 'utf8'));

// Strip down properties
geojson.features = geojson.features.map(feature => {
  feature.properties = {
    objectid: feature.properties.objectid,
    sa2_code_2021: feature.properties.sa2_code_2021,
    population: feature.properties.population,
    population_density: feature.properties.population_density
  };
  return feature;
});

// Write the stripped GeoJSON
fs.writeFileSync('sa2_stripped.geojson', JSON.stringify(geojson));

console.log(`Stripped properties from ${geojson.features.length} features`);