const fs = require('fs');
const path = require('path');

let output = '';
function log(msg) {
  output += msg + '\n';
  console.log(msg);
}

function searchDir(dirPath, patterns) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath, patterns);
    } else if (file.endsWith('.js')) {
      searchFile(fullPath, patterns);
    }
  });
}

function searchFile(filePath, patterns) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let loggedHeader = false;
  lines.forEach((line, index) => {
    const matched = patterns.filter(p => line.toLowerCase().includes(p.toLowerCase()));
    if (matched.length > 0) {
      if (!loggedHeader) {
        log(`\n=== Searching ${filePath} ===`);
        loggedHeader = true;
      }
      log(`Line ${index + 1} (matched: ${matched.join(', ')}): ${line.trim()}`);
    }
  });
}

searchFile('C:/Users/nghai/Projects/game-1/js/game.js', ['obstacles', 'takeDamage', 'ore_', 'ResourcePickup']);
fs.writeFileSync('C:/Users/nghai/Projects/game-1/search_output.txt', output, 'utf8');
log('Done!');
