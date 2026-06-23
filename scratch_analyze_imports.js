const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/nghai/OneDrive/Documents/Projects/js';

fs.readdirSync(dir).forEach(file => {
  if (!file.endsWith('.js')) return;
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const lines = content.split('\n');
  const imports = lines.filter(line => line.trim().startsWith('import'));
  console.log('=== ' + file + ' ===');
  imports.forEach(imp => console.log('  ' + imp.trim()));
});
