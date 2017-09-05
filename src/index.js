#!/usr/bin/env node
'use strict';

const exec = require('./exec-promise');
const endOfLine = require('os').EOL;

function parseNpmResult(npmResult) {
  const nodeModulePaths = npmResult
    .split(endOfLine)
    .filter((nodeModulePath, index) => {
      // first entry is always equal to current working directory path
      if (index === 0) {
        return false;
      }

      if (nodeModulePath === '') {
        return false;
      }

      return true;
    });

  return nodeModulePaths;
}

const nodeModulePaths = exec('npm ls --parseable')
  .then((npmResult) => {
    const nodeModules = parseNpmResult(npmResult);

    if (nodeModules.length === 0) {
      throw new Error('Could not find node_modules in current working directory');
    }
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
