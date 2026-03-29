const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Add type="module" to the Expo script tag so import.meta works in browser
html = html.replace(
  /<script src="(\/_expo\/[^"]+\.js)" defer><\/script>/,
  '<script type="module" src="$1"></script>'
);

fs.writeFileSync(indexPath, html);
console.log('Patched dist/index.html: added type="module" to script tag');
