'use strict';

const exec = require('child_process').exec;

function execPromise(command) {
  const promise = new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      resolve(stdout);
    });
  });

  return promise;
}

module.exports = execPromise;
