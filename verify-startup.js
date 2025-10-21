#!/usr/bin/env node

/**
 * Startup Verification Script
 * Checks if the project is ready to run without starting servers
 */

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkFile(path, description) {
  if (existsSync(join(__dirname, path))) {
    log(`✅ ${description}`, colors.green);
    return true;
  } else {
    log(`❌ ${description} - NOT FOUND`, colors.red);
    return false;
  }
}

console.log('\n' + '='.repeat(50));
log('FALO Startup Verification', colors.cyan);
console.log('='.repeat(50) + '\n');

let allChecks = true;

// Check Node.js version
log('Checking Node.js version...', colors.yellow);
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 18) {
  log(`✅ Node.js ${nodeVersion} (OK)`, colors.green);
} else {
  log(`❌ Node.js ${nodeVersion} (Need 18+)`, colors.red);
  allChecks = false;
}
console.log();

// Check directories
log('Checking project structure...', colors.yellow);
allChecks &= checkFile('backend', 'Backend directory');
allChecks &= checkFile('frontend', 'Frontend directory');
allChecks &= checkFile('backend/src', 'Backend source directory');
allChecks &= checkFile('frontend/src', 'Frontend source directory');
console.log();

// Check configuration files
log('Checking configuration files...', colors.yellow);
allChecks &= checkFile('backend/package.json', 'Backend package.json');
allChecks &= checkFile('frontend/package.json', 'Frontend package.json');
allChecks &= checkFile('backend/.env', 'Backend .env');
allChecks &= checkFile('frontend/.env', 'Frontend .env');
allChecks &= checkFile('backend/.env.example', 'Backend .env.example');
allChecks &= checkFile('frontend/.env.example', 'Frontend .env.example');
console.log();

// Check dependencies
log('Checking dependencies...', colors.yellow);
allChecks &= checkFile('backend/node_modules', 'Backend dependencies');
allChecks &= checkFile('frontend/node_modules', 'Frontend dependencies');
console.log();

// Check startup scripts
log('Checking startup scripts...', colors.yellow);
allChecks &= checkFile('start.js', 'Cross-platform start script');
allChecks &= checkFile('START.bat', 'Windows batch script');
allChecks &= checkFile('start-servers.ps1', 'PowerShell script');
allChecks &= checkFile('package.json', 'Root package.json');
console.log();

// Check entry points
log('Checking application entry points...', colors.yellow);
allChecks &= checkFile('backend/src/server.js', 'Backend server entry');
allChecks &= checkFile('frontend/src/main.jsx', 'Frontend entry point');
allChecks &= checkFile('frontend/index.html', 'Frontend HTML');
console.log();

// Final result
console.log('='.repeat(50));
if (allChecks) {
  log('✅ ALL CHECKS PASSED!', colors.green);
  log('\nThe project is ready to run. Choose a startup method:', colors.cyan);
  log('\n  Cross-platform:', colors.yellow);
  log('    npm start', colors.reset);
  log('\n  Windows-specific:', colors.yellow);
  log('    START.bat', colors.reset);
  log('    .\\start-servers.ps1', colors.reset);
  log('\n  Manual:', colors.yellow);
  log('    npm run start:backend (Terminal 1)', colors.reset);
  log('    npm run start:frontend (Terminal 2)', colors.reset);
  console.log('\n' + '='.repeat(50) + '\n');
  process.exit(0);
} else {
  log('❌ SOME CHECKS FAILED', colors.red);
  log('\nPlease fix the issues above before running the application.', colors.yellow);
  log('\nQuick fixes:', colors.cyan);
  log('  - Missing .env files? Copy the .env.example files or run npm start once to generate them', colors.reset);
  log('  - Missing dependencies? Run: npm run install:all', colors.reset);
  console.log('\n' + '='.repeat(50) + '\n');
  process.exit(1);
}
