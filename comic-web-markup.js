#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Parse command-line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: svg-to-png <input.svg> [output.png]');
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1] || 'output.png';

// Resolve file paths
const inputPath = path.resolve(inputFile);
const outputPath = path.resolve(outputFile);

// Check if the input file exists
if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input file "${inputPath}" does not exist.`);
  process.exit(1);
}

// Convert SVG to PNG
sharp(inputPath)
  .png()
  .toFile(outputPath)
  .then(() => {
    console.log(`Successfully converted ${inputPath} to ${outputPath}`);
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
