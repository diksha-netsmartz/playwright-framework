/**
 * Validation script to ensure every Playwright spec file contains a module tag.
 * 
 * Rules:
 * 1. Every *.spec.js file under tests/ must specify at least one tag in its test(...) call.
 * 2. The tag cannot solely be '@smoke' (it must contain a module tag such as @scheduling, @CSMHomepage, @CSPEnroll, etc.).
 */

const fs = require('fs');
const path = require('path');

function getSpecFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getSpecFiles(filePath));
    } else if (file.endsWith('.spec.js')) {
      results.push(filePath);
    }
  }
  return results;
}

const testsDir = path.join(process.cwd(), 'tests');
const specFiles = getSpecFiles(testsDir);

if (specFiles.length === 0) {
  console.error('Error: No spec files found under tests/ directory.');
  process.exit(1);
}

const missingModuleTag = [];
let passedCount = 0;

for (const filePath of specFiles) {
  const relPath = path.relative(process.cwd(), filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  // Regex to extract tag property: { tag: '@tag' } or { tag: ['@tag1', '@tag2'] }
  const tagRegex = /tag\s*:\s*(?:'([^']+)'|"([^"]+)"|`([^`]+)`|\[([\s\S]*?)\])/g;
  let match;
  const tags = [];

  while ((match = tagRegex.exec(content)) !== null) {
    if (match[1] || match[2] || match[3]) {
      tags.push(match[1] || match[2] || match[3]);
    } else if (match[4]) {
      const arrContent = match[4];
      const singleTagMatches = arrContent.match(/['"`](@[^'"`]+)['"`]/g) || [];
      singleTagMatches.forEach(t => tags.push(t.replace(/['"`]/g, '')));
    }
  }

  // Filter out non-module tags like '@smoke'
  const moduleTags = tags.filter(t => t.toLowerCase() !== '@smoke');

  if (moduleTags.length === 0) {
    missingModuleTag.push({
      file: relPath,
      existingTags: tags,
    });
  } else {
    passedCount++;
  }
}

console.log('---------------------------------------------------------');
console.log(' Playwright Spec Module Tag Validator');
console.log('---------------------------------------------------------');
console.log(`Total spec files scanned: ${specFiles.length}`);
console.log(`Files with module tags:   ${passedCount}`);
console.log(`Files missing module tag: ${missingModuleTag.length}`);
console.log('---------------------------------------------------------');

if (missingModuleTag.length > 0) {
  console.error('\n✖ FAILED: The following spec files do NOT contain a module tag:');
  missingModuleTag.forEach(item => {
    const current = item.existingTags.length > 0 ? item.existingTags.join(', ') : 'No tags found';
    console.error(`  • ${item.file} (Current tags: [${current}])`);
  });
  console.error('\nPlease add a module tag to each spec file (e.g. { tag: "@scheduling" } or { tag: ["@moduleTag", "@smoke"] }).\n');
  process.exit(1);
}

console.log(`\n✔ SUCCESS: All ${specFiles.length} spec files contain valid module tags!\n`);
process.exit(0);
