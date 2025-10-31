#!/usr/bin/env node
import { spawn } from 'node:child_process';

const url = process.argv[2] ?? 'http://localhost:3022';
const platform = process.platform;

const prefix = '[dev:auto-open]';

const logInfo = (message) => {
  console.log(`${prefix} ${message}`);
};

const logWarn = (message) => {
  console.warn(`${prefix} ${message}`);
};

let command;
let args;
let options = { stdio: 'ignore', detached: true };

if (platform === 'darwin') {
  command = 'open';
  args = [url];
} else if (platform === 'win32') {
  command = 'cmd';
  args = ['/c', 'start', '', url];
  options = { stdio: 'ignore', detached: true, windowsVerbatimArguments: true };
} else if (platform === 'linux' || platform === 'freebsd' || platform === 'openbsd') {
  command = 'xdg-open';
  args = [url];
} else {
  command = undefined;
}

if (!command) {
  logWarn(`Unsupported platform "${platform}". Please open ${url} manually.`);
  process.exit(0);
}

try {
  const child = spawn(command, args, options);

  child.on('error', (error) => {
    logWarn(`Unable to launch browser using ${command}: ${error.message}`);
    logWarn(`Please open ${url} manually.`);
  });

  // Some commands (like xdg-open) exit immediately; treat non-zero exit as warning.
  child.on('exit', (code) => {
    if (typeof code === 'number' && code !== 0) {
      logWarn(`Browser launcher ${command} exited with code ${code}. Please open ${url} manually.`);
    }
  });

  // Allow parent process to continue independently of detached child.
  if (typeof child.unref === 'function') {
    child.unref();
  }

  logInfo(`Attempting to open ${url} using ${command}.`);
} catch (error) {
  logWarn(`Failed to spawn ${command}: ${error.message}`);
  logWarn(`Please open ${url} manually.`);
}
