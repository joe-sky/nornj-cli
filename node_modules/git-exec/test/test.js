/*
 * git-exec - test script
 *
 * Copyright (c) 2013 Alex J Burke
 * Licensed under the MIT license.
 */

// imports
var fs = require('fs');
var path = require('path');

// local imports
var Git = require('../lib/git-exec');
var rimraf = require('rimraf');

// constants
var TEST_REPO = 'test_repo';
var TEST_PATH = 'test';

// node <0.8 compat
var exists = fs.exists || path.exists;

module.exports = exports = {
  tearDown: function (callback) {
    // delete any directory in the basic location
    rimraf(TEST_REPO, function() {
      // delete any directory present at the modified path
      rimraf(path.join(TEST_PATH, TEST_REPO), function() {
        callback();
      });
    });
  }
};

function checkRepoObject(test, repo, path) {
  path = path || TEST_REPO;

  exists(path, function(doesExist) {
    test.ok(doesExist, 'test repository was created');
    test.ok(repo, 'repository object created');
    test.ok(repo instanceof Git, 'repository object has correct type');
    test.ok(repo.directory, 'repository object path was set');
  });
}

exports.testClone = function(test) {
  var self = this;

  Git.clone('.', TEST_REPO, function(repo) {
    checkRepoObject(test, repo);
    test.done();
  });
};

exports.testCloneAtPath = function(test) {
  var self = this;
  var repo_path = path.join(TEST_PATH, TEST_REPO);

  Git.clone('.', repo_path, function(repo) {
    checkRepoObject(test, repo, repo_path);
    test.done();
  });
};

exports.testCloneWithoutPath = function(test) {
  var self = this;

  Git.clone('git://github.com/alexjeffburke/node-git-exec.git', null, function(repo) {
    test.strictEqual(repo, null, 'cannot clone without a target dir');
    test.done();
  });
};

exports.testInit = function(test) {
  var self = this;

  Git.init(TEST_REPO, null, function(repo) {
    checkRepoObject(test, repo);
    test.done();
  });
};

exports.testInitAtPathInDirArg = function(test) {
  var self = this;
  var repo_path = path.join(TEST_PATH, TEST_REPO);

  Git.init(null, repo_path, function(repo) {
    checkRepoObject(test, repo, repo_path);
    test.done();
  });
};

exports.testInitAtPathSplit = function(test) {
  var self = this;
  var repo_path = path.join(TEST_PATH, TEST_REPO);

  Git.init(TEST_REPO, TEST_PATH, function(repo) {
    checkRepoObject(test, repo, repo_path);
    test.done();
  });
};
