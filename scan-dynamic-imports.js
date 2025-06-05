const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();

function scanFileForDynamicImports(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  // Simple regex to catch dynamic requires or imports, e.g., require(variable), import(variable), or require(`./${var}.js`)
  const dynamicRequireRegex = /require\s*\(\s*[^'"].+?\s*\)/g;
  const dynamicImportRegex = /import\s*\(\s*[^'"].+?\s*\)/g;

  const results = [];

  if (dynamicRequireRegex.test(content)) {
    results.push("Dynamic require");
  }
  if (dynamicImportRegex.test(content)) {
    results.push("Dynamic import");
  }

  // Also check for require/import with template literals that include variables
  const templateRequireRegex = /require\s*\(\s*`[^`]*\$\{[^}]+\}[^`]*`\s*\)/g;
  const templateImportRegex = /import\s*\(\s*`[^`]*\$\{[^}]+\}[^`]*`\s*\)/g;

  if (templateRequireRegex.test(content)) {
    results.push("Template literal require");
  }
  if (templateImportRegex.test(content)) {
    results.push("Template literal import");
  }

  return results.length > 0 ? results : null;
}

function walk(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (/\.(js|ts|tsx|jsx)$/.test(file)) {
      const issues = scanFileForDynamicImports(fullPath);
      if (issues) {
        console.log(`[!] Dynamic import/require found in: ${fullPath}`);
        issues.forEach((issue) => console.log(`  - ${issue}`));
        console.log("");
      }
    }
  });
}

console.log("Scanning project for dynamic import/require usage...\n");
walk(projectRoot);
console.log("Scan complete.");
