const fs = require('node:fs');
const path = require('node:path');
const asar = require('@electron/asar');

const repoRoot = path.resolve(__dirname, '..');
const outDir = path.join(repoRoot, 'out');

const forbiddenPathPatterns = [
  /(^|[/\\])coverage($|[/\\])/,
  /(^|[/\\])tests($|[/\\])/,
  /(^|[/\\])vitest\.config\.[jt]s$/,
  /(^|[/\\]).*\.(test|spec)\.(ts|tsx|js|jsx)$/,
  /(^|[/\\])node_modules[/\\]vitest($|[/\\])/,
  /(^|[/\\])node_modules[/\\]@vitest($|[/\\])/,
  /(^|[/\\])node_modules[/\\]jsdom($|[/\\])/,
  /(^|[/\\])node_modules[/\\]@testing-library($|[/\\])/,
];

function normalizePath(filePath) {
  return filePath.replaceAll(path.sep, '/').replace(/^\/+/, '');
}

function isForbidden(filePath) {
  const normalized = normalizePath(filePath);
  return forbiddenPathPatterns.some(pattern => pattern.test(normalized));
}

function walkDirectory(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDirectory(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

if (!fs.existsSync(outDir)) {
  console.error('No out/ directory found. Run `npm run package` before verifying release artifacts.');
  process.exit(1);
}

const failures = [];

for (const filePath of walkDirectory(outDir)) {
  const relativePath = path.relative(repoRoot, filePath);
  if (isForbidden(relativePath)) {
    failures.push(relativePath);
  }

  if (filePath.endsWith('.asar')) {
    for (const asarPath of asar.listPackage(filePath)) {
      if (isForbidden(asarPath)) {
        failures.push(`${relativePath}:${asarPath}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error('Release artifact verification failed. Test-only files or packages were found:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Release artifact verification passed. No test-only files or packages were found in out/.');
