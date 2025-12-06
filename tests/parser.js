// parser.js

/**
 * Parses data from a CSV file into a structured format suitable for machine learning models.
 *
 * @param {string} csvData - The CSV data as a string.
 * @param {object} options - Optional configuration object.
 * @param {string} options.delimiter - The delimiter used in the CSV file (default: ',').
 * @param {boolean} options.header - Whether the first row is a header row (default: true).
 * @param {Array<string>} options.columns -  An array of column names to use, overrides header row if present.
 * @param {function(string): any} options.typeInference - Function to infer data type from string (default: tries Number conversion).  Returns original string if type inference fails.
 *
 * @returns {object} - An object containing:
 *   - header: An array of column names.
 *   - data: An array of objects, where each object represents a row of data.
 *   - errors: An array of error objects encountered during parsing.
 */
function parseCSV(csvData, options = {}) {
  const delimiter = options.delimiter || ',';
  const hasHeader = options.header !== false; // Default to true
  const inferTypes = options.typeInference || function(str) {
    const num = Number(str);
    return isNaN(num) ? str : num;
  };
  const errors = [];

  const lines = csvData.trim().split('\n');
  if (lines.length === 0) {
    return { header: [], data: [], errors: [] };
  }

  let header = options.columns || (hasHeader ? lines.shift().split(delimiter).map(col => col.trim()) : []);
  if (header.length === 0 && lines.length > 0) {
    // Infer header if not provided and no header row exists. Use first row to determine number of columns
    header = Array.from({length: lines[0].split(delimiter).length}, (_, i) => `column_${i+1}`);
  }

  const data = lines.map((line, lineNumber) => {
    const values = line.split(delimiter).map(val => val.trim());
    if (values.length !== header.length) {
      errors.push({
        message: `Row ${lineNumber + (hasHeader ? 2 : 1)} has incorrect number of columns. Expected ${header.length}, got ${values.length}.`,
        row: lineNumber + (hasHeader ? 2 : 1),
        expected: header.length,
        actual: values.length
      });
    }

    const row = {};
    for (let i = 0; i < header.length; i++) {
      const value = values[i] || ''; // Handle missing values
      row[header[i]] = inferTypes(value);
    }
    return row;
  });

  return { header, data, errors };
}

/**
 *  Parses JSON data from a string.
 *
 *  @param {string} jsonData - The JSON data as a string.
 *  @returns {object} - The parsed JSON object, or null if parsing fails.
 */
function parseJSON(jsonData) {
  try {
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error parsing JSON:", error.message);
    return null;
  }
}

module.exports = {
  parseCSV,
  parseJSON
};