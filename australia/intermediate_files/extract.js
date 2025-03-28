const XLSX = require('xlsx');
const fs = require('fs');
const zlib = require('zlib');

function parseNumberString(value) {
  // Remove commas and convert to number
  if (typeof value === 'string') {
      return parseFloat(value.replace(/,/g, ''));
  }
  return value;
}

function extractPopulationData(filePath, sheetName) {
    // Read the workbook
    const workbook = XLSX.readFile(filePath);

    // Get the specified sheet
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON, starting from row 7 (0-indexed)
    const data = XLSX.utils.sheet_to_json(worksheet, {
        range: 6,  // Start from 7th row (0-indexed)
        raw: false // Converts numbers to strings to help with type checking
    });

    // Filter and transform the data
    const filteredData = data
        .filter(row =>
            // Check if Code is exactly 9 digits
            String(row.Code).length === 9 &&
            // Check if Year is 2023
            row.Year === '2023'
        )
        .map(row => ({
            C: row.Code,
            P: row['Estimated resident population (no.)'] !== '-'
                ? parseInt(row['Estimated resident population (no.)'].replace(/,/g, ''))
                : null,
            D: row['Population density (persons/km2)'] !== '-'
              ? parseNumberString(row['Population density (persons/km2)'])
              : null
        }));

    // Minified JSON (no whitespace)
    const minifiedJson = JSON.stringify(filteredData);

    // Write minified JSON file
    fs.writeFileSync('population_data_2023.min.json', minifiedJson);

    // Optional: Create a compressed version
    const gzip = zlib.createGzip();
    const input = fs.createReadStream('population_data_2023.min.json');
    const output = fs.createWriteStream('population_data_2023.min.json.gz');
    input.pipe(gzip).pipe(output);

    console.log(`Extracted ${filteredData.length} records to population_data_2023.min.json`);
    console.log(`Compressed version created at population_data_2023.min.json.gz`);

    return filteredData;
}

// Usage
try {
    const extractedData = extractPopulationData('14100DO0001_2011-24.xlsx', 'Table 1');
    console.log(extractedData);
} catch (error) {
    console.error('Error processing file:', error);
}

module.exports = extractPopulationData;