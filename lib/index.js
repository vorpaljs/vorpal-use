
'use strict';

/**
 * Module dependencies.
 */

var npm = require('npm');
var chalk = require('chalk');
var temp = require('temp');

module.exports = function (vorpal) {
  /**
   * Imports node module in realtime.
   */

  vorpal
    .command('use <module>')
    .description('Installs a Vorpal extension in realtime.')
    .option('-l, --loglevel', 'Sets log level of module install')
    .action(function (args, cb) {
      var self = this;
      var options = {
        loglevel: args.options.loglevel || 'error',
        module: args.module
      };
      self.log(chalk.white('Installing ' + options.module + ' from the NPM registry:'));
      _use.call(vorpal, options, function (err, data) {
        if (err) {
          self.log(err);
        } else {
          var commands = (data || {}).registeredCommands;
          if (commands < 1) {
            self.log(chalk.yellow('No new commands were registered. Are you sure you ' + options.module + ' is a vorpal extension?'));
          } else {
            self.log(chalk.white('Successfully registered ' + commands + ' new command' + ((commands > 1) ? 's' : '') + '.'));
          }
        }
        cb();
      });
    });
};

/**
 * Requires a vantage module / middleware and
 * and `.use`s it. If the module doesn't exist
 * locally, it will NPM install it into a temp
 * directory and then use it.
 *
 * @param {String} key
 * @param {String} value
 * @return {Function}
 * @api private
 */

function _use(options, callback) {
  var self = this;
  var config;
  var registeredCommands = 0;

  options = (typeof options === 'string')
    ? {module: options}
    : (options || {});

  options.loglevel = options.loglevel || 'silent';

  config = {
    loglevel: options.loglevel,
    production: true
  };

  function registryCounter() {
    registeredCommands++;
  }

  function load(cbk) {
    npm.load(config, function () {
      npm.registry.log.level = config.loglevel;
      npm.commands.install(temp.dir, [options.module], function (err, data) {
        if (err) {
          cbk(err, data);
        } else {
          var dir = temp.dir + '/node_modules/' + options.module;
          var mod = require(dir);
          cbk(undefined, mod);
        }
      });
    });
  }

  load(function (err, mod) {
    if (err) {
      callback(true, 'Error downloading module: ' + mod);
    } else {
      self.on('command_registered', registryCounter);
      self.use(mod);
      self.removeListener('command_registered', registryCounter);
      var data = {
        registeredCommands: registeredCommands
      };
      callback(undefined, data);
    }
  });
}
