const fs = require('fs');

let output = '';
function log(msg) {
  output += msg + '\n';
  console.log(msg);
}

function searchFile(filePath, patterns) {
  log(`\n=== Searching ${filePath} ===`);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    const hasPattern = patterns.some(p => line.includes(p));
    if (hasPattern) {
      log(`Line ${index + 1}: ${line.trim()}`);
    }
  });
}

searchFile('c:/Users/nghai/OneDrive/Documents/Projects/js/spell.js', ['wolf_z', 'gainRage', 'gainRage']);
searchFile('c:/Users/nghai/OneDrive/Documents/Projects/js/player.js', ['gainRage', 'rage', 'wolf_v']);

fs.writeFileSync('c:/Users/nghai/OneDrive/Documents/Projects/search_output.txt', output, 'utf8');
log('Done!');
