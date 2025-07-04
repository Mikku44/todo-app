#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Capitalize utility: converts "my-module" -> "MyModule"
function capitalize(name) {
  return name
    .split(/[-_ ]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

// Utility to fetch content using https
function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      })
      .on('error', () =>   reject(null));
  });
}

// Main async function
(async () => {
  const rawName = process.argv[2];
  if (!rawName) {
    console.error("❌ Error: Please provide a module name!");
    console.log("💡 Usage: npm run add <module-name>");
    process.exit(1);
  }
  const moduleName = capitalize(rawName);

  const modulePath = path.join(__dirname, 'src', 'app', 'modules', moduleName);
  const layoutPath = path.join(__dirname, 'src', 'app', 'layout.tsx');

  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });

    try {
      const content = await fetchHtml("asdf");
      const componentContent = `import React from 'react';\n\nexport default function ${moduleName}() {\n  return (\n    <div className="${moduleName.toLowerCase()}">\n    {/* ${moduleName} content */}\n    ${content}\n    </div>\n  );\n}\n`;
      fs.writeFileSync(path.join(modulePath, `${moduleName}.tsx`), content || componentContent);
    } catch (err) {
      console.error("❌ Failed to fetch HTML:", err);
      process.exit(1);
    }

    try {
      let layoutContent = fs.readFileSync(layoutPath, 'utf8');

      const importStatement = `import ${moduleName} from './modules/${moduleName}/${moduleName}';\n`;
      if (!layoutContent.includes(importStatement)) {
        layoutContent = layoutContent.replace(
          /^import.*from.*;?\n/m,
          `$&${importStatement}`
        );
      }

      if (!layoutContent.includes(`<${moduleName} />`)) {
        layoutContent = layoutContent.replace(
          /(\{children\})([\s\S]*?)(<\/?[^>]*>)?/,
          `{children}\n      <${moduleName} />$2$3`
        );
      }

      fs.writeFileSync(layoutPath, layoutContent);
      console.log(`✅ Module "${moduleName}" created and injected into layout.tsx`);
    } catch (err) {
      console.error(`⚠️ Couldn't update layout.tsx: ${err.message}`);
    }
  } else {
    console.log(`⚠️ Module "${moduleName}" already exists!`);
  }
})();
