document.addEventListener('DOMContentLoaded', function() {
    // Initialize map centered on Australia
    const map = L.map('map').setView([-25.2744, 133.7751], 4);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let geojsonData = null;
    let sortedFeatures = [];
    let highlightedLayer = L.layerGroup().addTo(map);
    let totalPopulation = 0;

    // Function to load GeoJSON data
    async function loadGeoJSON() {
        try {
            // Let the browser handle decompression automatically with proper headers
            const response = await fetch('australia.geojson', {
                headers: {
                    'Accept-Encoding': 'gzip'
                }
            });

            // Browser automatically decompresses the content
            geojsonData = await response.json();

            // Calculate total population
            totalPopulation = geojsonData.features.reduce((sum, feature) => {
                return sum + (feature.properties.population || 0);
            }, 0);

            // Sort features by population density (highest to lowest)
            sortedFeatures = [...geojsonData.features].sort((a, b) => {
                return (b.properties.population_density || 0) - (a.properties.population_density || 0);
            });

            // Initialize with 50%
            updateMap(50);
        } catch (error) {
            console.error('Error loading GeoJSON:', error);
            // Fallback to uncompressed file if loading fails
            try {
                const response = await fetch('australia.geojson');
                geojsonData = await response.json();

                totalPopulation = geojsonData.features.reduce((sum, feature) => {
                    return sum + (feature.properties.population || 0);
                }, 0);

                sortedFeatures = [...geojsonData.features].sort((a, b) => {
                    return (b.properties.population_density || 0) - (a.properties.population_density || 0);
                });

                updateMap(50);
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
        }
    }

    // Function to update map based on percentage
    function updateMap(percentage) {
        highlightedLayer.clearLayers();

        if (!sortedFeatures.length) return;

        const targetPopulation = (totalPopulation * percentage) / 100;
        let currentPopulation = 0;
        let highlightedFeatures = [];
        let totalArea = 0;

        // Add features until we reach the target percentage
        for (let feature of sortedFeatures) {
            const featurePopulation = feature.properties.population || 0;
            if (currentPopulation + featurePopulation <= targetPopulation || highlightedFeatures.length === 0) {
                highlightedFeatures.push(feature);
                currentPopulation += featurePopulation;
                // Calculate area if available or approximate from feature
                const featureArea = feature.properties.area_sqkm || 0;
                totalArea += featureArea;
            } else {
                break;
            }
        }

        // Add highlighted features to map
        L.geoJSON(highlightedFeatures, {
            style: {
                fill: true,
                stroke: true,
                fillColor: 'red',
                color: 'red',
                weight: 1,
                fillOpacity: 1,
                opacity: 1
            }
        }).addTo(highlightedLayer);

        // Update stats display
        document.getElementById('percentage').textContent = percentage;
        document.getElementById('highlighted-pop').textContent = currentPopulation.toLocaleString();
    }

    // Slider event listener
    document.getElementById('slider').addEventListener('input', function(e) {
        const percentage = parseInt(e.target.value);
        updateMap(percentage);
    });

    // Load data
    loadGeoJSON();
});