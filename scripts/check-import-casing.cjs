const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');
const sourceExtensions = /\.(tsx?|jsx?|cjs|mjs)$/;
const resolutionExtensions = ['', '.ts', '.tsx', '.js', '.jsx', '.json', '.cjs', '.mjs'];
const indexFiles = ['index.ts', 'index.tsx', 'index.js', 'index.jsx', 'index.json'];
const importPattern = /(?:import|export)\s+(?:[^"'()]+?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;

function gitFiles() {
  return childProcess
    .execFileSync('git', ['ls-files'], { cwd: repoRoot, encoding: 'utf8' })
    .trim()
    .split(/\n/)
    .filter(Boolean);
}

function exactPathExists(filePath) {
  const resolvedPath = path.resolve(repoRoot, filePath);
  const parsedPath = path.parse(resolvedPath);
  let currentDirectory = parsedPath.root;
  const pathParts = resolvedPath.slice(parsedPath.root.length).split(path.sep).filter(Boolean);

  for (const pathPart of pathParts) {
    let entries;
    try {
      entries = fs.readdirSync(currentDirectory);
    } catch {
      return false;
    }

    if (!entries.includes(pathPart)) {
      return false;
    }

    currentDirectory = path.join(currentDirectory, pathPart);
  }

  return true;
}

function importCandidates(basePath) {
  const candidates = [];

  for (const extension of resolutionExtensions) {
    candidates.push(basePath + extension);
  }

  for (const extension of resolutionExtensions) {
    for (const indexFile of indexFiles) {
      candidates.push(path.join(basePath + extension, indexFile));
    }
  }

  return candidates;
}

function caseCollisions(files) {
  const filesByLowercasePath = new Map();

  for (const file of files) {
    const key = file.toLowerCase();
    filesByLowercasePath.set(key, [...(filesByLowercasePath.get(key) || []), file]);
  }

  return [...filesByLowercasePath.values()].filter(paths => paths.length > 1);
}

function importCasingFailures(files) {
  const failures = [];
  const sourceFiles = files.filter(file => sourceExtensions.test(file));

  for (const file of sourceFiles) {
    const source = fs.readFileSync(path.join(repoRoot, file), 'utf8');

    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1] || match[2];
      if (!specifier?.startsWith('.')) {
        continue;
      }

      const basePath = path.resolve(repoRoot, path.dirname(file), specifier);
      if (!importCandidates(basePath).some(exactPathExists)) {
        failures.push(`${file}: ${specifier}`);
      }
    }
  }

  return failures;
}

const files = gitFiles();
const collisions = caseCollisions(files);
const failures = importCasingFailures(files);

if (collisions.length > 0 || failures.length > 0) {
  if (collisions.length > 0) {
    console.error('Case-colliding tracked paths found:');
    for (const collision of collisions) {
      console.error(`- ${collision.join(', ')}`);
    }
  }

  if (failures.length > 0) {
    console.error('Relative imports with missing or mismatched filesystem casing found:');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
  }

  process.exit(1);
}

console.log('Import casing check passed.');
