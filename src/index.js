#!/usr/bin/env node
'use strict';

const endOfLine = require('os').EOL;
const exec = require('./exec-promise');
const fs = require('fs-extra');
const path = require('path');

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

function hasAureliaResources(packageContent) {
  const hasResources = Boolean(packageContent.aurelia)
    && Boolean(packageContent.aurelia.build)
    && Boolean(packageContent.aurelia.build.resources)
    && packageContent.aurelia.build.resources.length > 0;

  return hasResources;
}

function buildAureliaConfigEntry(packageContent) {
  if (!packageContent.main) {
    return null;
  }

  const name = packageContent.name;
  const mainDirPath = path.dirname(packageContent.main);
  const mainFile = path.basename(packageContent.main, '.js');
  const pathToModule = `../node_modules/${name}/${mainDirPath}`;
  const resources = packageContent.aurelia.build.resources;

  const configEntry = {
    name: name,
    path: pathToModule,
    main: mainFile,
    resources: resources,
  };

  return configEntry;
}

function getAureliaResources(nodeModulePaths) {
  const promises = [];

  for (const nodeModulePath of nodeModulePaths) {
    const pathToPackageFile = path.join(nodeModulePath, 'package.json');

    const promise = fs.readFile(pathToPackageFile)
      .then(JSON.parse)
      .then((packageContent) => {
        const hasResources = hasAureliaResources(packageContent);

        if (!hasResources) {
          return null;
        }

        return buildAureliaConfigEntry(packageContent);
      });

    promises.push(promise);
  }

  return Promise.all(promises)
    .then((aureliaResources) => {
      return aureliaResources.filter((resource) => {
        const isNotNull = resource !== null;
        return isNotNull;
      });
    });
}

function sortAureliaConfigEntries(configEntries) {
  return configEntries
    .slice()
    .sort((configEntryA, configEntryB) => {
      const compareResult = configEntryA.name.localeCompare(configEntryB.name);
      return compareResult;
    });
}

exec('npm ls --parseable')
  .then((npmResult) => {
    const nodeModulePaths = parseNpmResult(npmResult);

    if (nodeModulePaths.length === 0) {
      throw new Error('Could not find node_modules in current working directory');
    }

    return getAureliaResources(nodeModulePaths);
  })
  .then((aureliaResources) => {
    if (aureliaResources.length === 0) {
      throw new Error('No Aurelia resource were found.');
    }

    const sortedAureliaResources = sortAureliaConfigEntries(aureliaResources);
    const aureliaResourcesAsJson = JSON.stringify(sortedAureliaResources, null, 2);
    console.log(aureliaResourcesAsJson);
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
