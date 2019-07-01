'use strict';

const { getTemplatePath } = require('./utils');
const targz = require('targz');
const { sep } = require('path');

function tar(name) {
  targz.compress(
    {
      src: getTemplatePath(true) + name,
      dest: getTemplatePath() + `${name}.tar.gz`,
      tar: {
        ignore: function(name) {
          return (
            name.endsWith(`${sep}node_modules`) ||
            name.includes(`${sep}node_modules${sep}`) ||
            name.endsWith(`${sep}yarn.lock`) ||
            name.endsWith(`${sep}package-lock.json`)
          );
        }
      }
    },
    function(err) {
      if (err) {
        console.log(err);
      }

      console.log(`${name}.tar.gz create completed!`);
    }
  );
}

tar('react-mst');
tar('react-mst-app');
