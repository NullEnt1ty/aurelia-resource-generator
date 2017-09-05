#!/usr/bin/env node
'use strict';

const exec = require('./exec-promise');

const nodeModulePaths = exec('npm ls --parseable')
  .then((stdout) => {
    console.log(stdout);
  });
