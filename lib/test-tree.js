var babel = require('broccoli-babel-transpiler'),
    concat = require('broccoli-concat'),
    EmberScript = require('broccoli-ember-script'),
    mergeTrees = require('broccoli-merge-trees'),
    pickFiles = require('broccoli-static-compiler'),
    writeFile = require('broccoli-file-creator');

var modules =  new EmberScript('test', {
  bare: true
});

modules = babel(modules, {
  modules: 'system',
  moduleIds: true,
  externalHelpers: true,
  //sourceMap: 'inline',
  sourceRoot: 'coalesce-ember-test'
});
//tree = sourceMap.extract(tree);
modules = concat(modules, {
  inputFiles: ['**/*.js'],
  outputFile: '/test/coalesce-ember-test.system.js'
});

var vendor = mergeTrees(['bower_components', 'node_modules']);
vendor = pickFiles(vendor, {
  srcDir: '/',
  files: [
    'babel-core/browser-polyfill.js',
    'babel-core/external-helpers.js',
    'es6-module-loader/dist/es6-module-loader.js',
    'es6-module-loader/dist/es6-module-loader.js.map',
    'systemjs/dist/system.js',
    'jquery/dist/jquery.js',
    'lodash/dist/lodash.js',
    'sinonjs/sinon.js',
    'handlebars/handlebars.runtime.js',
    'ember/ember.js',
    'ember-mocha-adapter/adapter.js',
    'mocha/mocha.js',
    'mocha/mocha.css',
    'chai/chai.js',
    'coalesce/dist/coalesce.system.js'
  ],
  destDir: 'test/vendor'
});

var index = pickFiles('test', {
  srcDir: '/',
  destDir: '/test',
  files: ['index.html']
});

var testemDummy = writeFile('testem.js', '');

module.exports = mergeTrees([index, modules, vendor, testemDummy]);
