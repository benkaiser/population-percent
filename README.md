# Population Percent Visualization

An interactive web visualization project that shows population distribution across different countries using a percentage-based slider approach.

## Overview

This project provides interactive maps that allow users to visualize what percentage of a country's population lives in specific areas. By adjusting a slider, users can see how population is distributed geographically, highlighting the often stark contrast between densely populated urban centers and sparsely populated rural regions.

## Features

- Interactive slider to adjust population percentage thresholds
- Real-time visualization of population distribution on maps
- Data sourced from official government statistics
- Responsive design for desktop and mobile devices

## Available Visualizations

### Australia

Explore how Australia's population is heavily concentrated in coastal urban areas, with vast portions of the interior containing only a small percentage of the total population.

## Technical Implementation

The visualizations use:
- Leaflet.js for interactive maps
- Population data from official government statistics
- Custom algorithms to calculate progressive area coverage for different population percentages

## Local Development

To run this project locally:

1. Clone the repository
```
git clone https://github.com/yourusername/population-percent.git
```

2. Navigate to the project directory
```
cd population-percent
```

3. Open `index.html` in your browser, or use a local server:
```
python -m http.server
```
Then visit `http://localhost:8000` in your browser.

## Contributing

Contributions are welcome! If you'd like to add visualizations for additional countries or improve the existing ones, please:

1. Fork the repository
2. Create a new branch for your feature
3. Add your visualization
4. Submit a pull request

## Data Sources

- Australia: [Australian Bureau of Statistics](https://www.abs.gov.au/statistics/people/population/regional-population/latest-release)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
