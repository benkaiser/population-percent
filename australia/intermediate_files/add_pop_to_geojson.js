const fs = require('fs');

// Read the files
const geojson = JSON.parse(fs.readFileSync('sa2_filtered.geojson', 'utf8'));
const populationData = JSON.parse(fs.readFileSync('population_data_2023.min.json', 'utf8'));

// Create a map of population data for quick lookups
const populationMap = new Map(
  populationData.map(item => [item.C, { population: item.P, population_density: item.D }])
);

// Merge population data into GeoJSON features
geojson.features = geojson.features.map(feature => {
  const sa2Code = feature.properties.sa2_code_2021;
  const populationInfo = populationMap.get(sa2Code);

  if (populationInfo) {
    feature.properties = {
      ...feature.properties,
      ...populationInfo
    };
  }

  return feature;
});

// Write the merged GeoJSON
fs.writeFileSync('sa2_with_population.geojson', JSON.stringify(geojson));

console.log(`Merged ${geojson.features.length} features`);