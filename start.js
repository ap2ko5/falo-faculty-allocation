#!/usr/bin/env node

/**
 * Cross-Platform Startup Script for FALO Faculty Allocation System
 * Works on Windows, macOS, and Linux
 * 
 * Usage: node start.js
 */

import { spawn } from 'child_process';
import { platform } from 'os';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isWindows = platform() === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkNodeModules(dir) {
  return existsSync(join(__dirname, dir, 'node_modules'));
}

function runCommand(command, args, options) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      ...options,
      shell: true,
      stdio: 'inherit',
    });

    proc.on('error', reject);
    proc.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
}

async function installDependencies(dir, name) {
  const dirPath = join(__dirname, dir);
  
  if (!checkNodeModules(dir)) {
    log(`\n📦 Installing ${name} dependencies...`, colors.yellow);
    try {
      await runCommand(npmCmd, ['install'], { cwd: dirPath });
      log(`✅ ${name} dependencies installed`, colors.green);
    } catch (error) {
      log(`❌ Failed to install ${name} dependencies`, colors.red);
      throw error;
    }
  } else {
    log(`✅ ${name} dependencies already installed`, colors.green);
  }
}

function startServer(dir, name, scriptName) {
  const dirPath = join(__dirname, dir);
  
  log(`\n🚀 Starting ${name}...`, colors.cyan);
  
  const proc = spawn(npmCmd, ['run', scriptName], {
    cwd: dirPath,
    shell: true,
    stdio: 'inherit',
  });

  proc.on('error', (error) => {
    log(`❌ Error starting ${name}: ${error.message}`, colors.red);
  });

  return proc;
}

async function main() {
  log('\n========================================', colors.cyan);
  log('  FALO Faculty Allocation System', colors.cyan);
  log('  Cross-Platform Startup', colors.cyan);
  log('========================================\n', colors.cyan);

  try {
    // Check for Node.js and npm
    log('🔍 Checking Node.js and npm...', colors.yellow);
    await runCommand('node', ['--version']);
    await runCommand(npmCmd, ['--version']);
    log('✅ Node.js and npm detected\n', colors.green);

    // Install dependencies if needed
    await installDependencies('backend', 'Backend');
    await installDependencies('frontend', 'Frontend');

    log('\n========================================', colors.cyan);
    log('  Starting Servers', colors.cyan);
    log('========================================\n', colors.cyan);

    // Start backend
    const backend = startServer('backend', 'Backend', 'start');
    
    // Wait a bit for backend to initialize
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start frontend
    const frontend = startServer('frontend', 'Frontend', 'dev');

    log('\n========================================', colors.green);
    log('  SERVERS STARTED SUCCESSFULLY!', colors.green);
    log('========================================\n', colors.green);
    log('Backend:  http://localhost:5051/api', colors.cyan);
    log('Frontend: http://localhost:3000\n', colors.cyan);
    log('========================================\n', colors.cyan);
    log('Press Ctrl+C to stop both servers\n', colors.yellow);

    // Handle Ctrl+C to kill both processes
    process.on('SIGINT', () => {
      log('\n\n🛑 Shutting down servers...', colors.yellow);
      backend.kill();
      frontend.kill();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      backend.kill();
      frontend.kill();
      process.exit(0);
    });

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

main();
