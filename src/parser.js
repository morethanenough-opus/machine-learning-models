const fs = require('fs');
const path = require('path');

class Parser {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async readData() {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf8');
      return data;
    } catch (error) {
      console.error(`Error reading file: ${error}`);
      throw error;
    }
  }

  parseData(data) {
    const lines = data.split('\n');
    const parsedData = [];

    lines.forEach((line) => {
      const values = line.split(',');
      if (values.length > 0) {
        parsedData.push({
          id: values[0],
          features: values.slice(1).map((value) => parseFloat(value)),
        });
      }
    });

    return parsedData;
  }

  async parseFile() {
    const data = await this.readData();
    return this.parseData(data);
  }
}

module.exports = Parser;