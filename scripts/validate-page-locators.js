/**
 * Validation script to ensure no duplicate locators exist in Page Object constructors.
 * 
 * Rules:
 * 1. Scans all *.js files under pages/.
 * 2. Parses the class constructor and ensures no property on `this` is assigned more than once.
 * 3. Exits with 0 if all clean, or 1 with clear file & line info if duplicates are found.
 */

const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else if (file.endsWith('.js')) {
      results.push(filePath);
    }
  }
  return results;
}

const pagesDir = path.join(process.cwd(), 'pages');
const pageFiles = getFiles(pagesDir);

if (pageFiles.length === 0) {
  console.error('Error: No page files found under pages/ directory.');
  process.exit(1);
}

const duplicates = [];

for (const filePath of pageFiles) {
  const relPath = path.relative(process.cwd(), filePath);
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');

  let inConstructor = false;
  let braceCount = 0;
  const seenLocators = new Map();

  lines.forEach((line, idx) => {
    if (/constructor\s*\(/.test(line)) {
      inConstructor = true;
      braceCount = 0;
    }

    if (inConstructor) {
      for (const ch of line) {
        if (ch === '{') braceCount++;
        if (ch === '}') {
          braceCount--;
          if (braceCount <= 0) {
            inConstructor = false;
          }
        }
      }

      // Check locator / property assignments: this.propertyName = ...
      const match = line.match(/^\s*this\.([a-zA-Z0-9_$]+)\s*=/);
      if (match) {
        const prop = match[1];
        if (seenLocators.has(prop)) {
          duplicates.push({
            file: relPath,
            property: prop,
            firstLine: seenLocators.get(prop),
            secondLine: idx + 1
          });
        } else {
          seenLocators.set(prop, idx + 1);
        }
      }
    }
  });
}

console.log('---------------------------------------------------------');
console.log(' Page Object Locator Duplicate Validator');
console.log('---------------------------------------------------------');
console.log(`Total page files scanned: ${pageFiles.length}`);
console.log(`Duplicates found:         ${duplicates.length}`);
console.log('---------------------------------------------------------');

if (duplicates.length > 0) {
  console.error('\n✖ FAILED: Duplicate locator declarations found in constructors:\n');
  duplicates.forEach(d => {
    console.error(`  • ${d.file}: 'this.${d.property}' declared at line ${d.firstLine} and line ${d.secondLine}`);
  });
  console.error('\nPlease remove duplicate locator declarations.\n');
  process.exit(1);
}

console.log(`\n✔ SUCCESS: All ${pageFiles.length} page files are free of duplicate locators!\n`);
process.exit(0);
