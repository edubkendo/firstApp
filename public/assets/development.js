;(function(){


// CommonJS require()

function require(p){
    var path = require.resolve(p)
      , mod = require.modules[path];
    if (!mod) throw new Error('failed to require "' + p + '"');
    if (!mod.exports) {
      mod.exports = {};
      mod.call(mod.exports, mod, mod.exports, require.relative(path));
    }
    return mod.exports;
  }

require.modules = {};

require.resolve = function (path){
    var orig = path
      , reg = path + '.js'
      , index = path + '/index.js';
    return require.modules[reg] && reg
      || require.modules[index] && index
      || orig;
  };

require.register = function (path, fn){
    require.modules[path] = fn;
  };

require.relative = function (parent) {
    return function(p){
      if ('.' != p.charAt(0)) return require(p);
      
      var path = parent.split('/')
        , segs = p.split('/');
      path.pop();
      
      for (var i = 0; i < segs.length; i++) {
        var seg = segs[i];
        if ('..' == seg) path.pop();
        else if ('.' != seg) path.push(seg);
      }

      return require(path.join('/'));
    };
  };


require.register("browser/debug.js", function(module, exports, require){

module.exports = function(type){
  return function(){
    
  }
};
}); // module: browser/debug.js

require.register("browser/diff.js", function(module, exports, require){

}); // module: browser/diff.js

require.register("browser/events.js", function(module, exports, require){

/**
 * Module exports.
 */

exports.EventEmitter = EventEmitter;

/**
 * Check if `obj` is an array.
 */

function isArray(obj) {
  return '[object Array]' == {}.toString.call(obj);
}

/**
 * Event emitter constructor.
 *
 * @api public.
 */

function EventEmitter(){};

/**
 * Adds a listener.
 *
 * @api public
 */

EventEmitter.prototype.on = function (name, fn) {
  if (!this.$events) {
    this.$events = {};
  }

  if (!this.$events[name]) {
    this.$events[name] = fn;
  } else if (isArray(this.$events[name])) {
    this.$events[name].push(fn);
  } else {
    this.$events[name] = [this.$events[name], fn];
  }

  return this;
};

EventEmitter.prototype.addListener = EventEmitter.prototype.on;

/**
 * Adds a volatile listener.
 *
 * @api public
 */

EventEmitter.prototype.once = function (name, fn) {
  var self = this;

  function on () {
    self.removeListener(name, on);
    fn.apply(this, arguments);
  };

  on.listener = fn;
  this.on(name, on);

  return this;
};

/**
 * Removes a listener.
 *
 * @api public
 */

EventEmitter.prototype.removeListener = function (name, fn) {
  if (this.$events && this.$events[name]) {
    var list = this.$events[name];

    if (isArray(list)) {
      var pos = -1;

      for (var i = 0, l = list.length; i < l; i++) {
        if (list[i] === fn || (list[i].listener && list[i].listener === fn)) {
          pos = i;
          break;
        }
      }

      if (pos < 0) {
        return this;
      }

      list.splice(pos, 1);

      if (!list.length) {
        delete this.$events[name];
      }
    } else if (list === fn || (list.listener && list.listener === fn)) {
      delete this.$events[name];
    }
  }

  return this;
};

/**
 * Removes all listeners for an event.
 *
 * @api public
 */

EventEmitter.prototype.removeAllListeners = function (name) {
  if (name === undefined) {
    this.$events = {};
    return this;
  }

  if (this.$events && this.$events[name]) {
    this.$events[name] = null;
  }

  return this;
};

/**
 * Gets all listeners for a certain event.
 *
 * @api publci
 */

EventEmitter.prototype.listeners = function (name) {
  if (!this.$events) {
    this.$events = {};
  }

  if (!this.$events[name]) {
    this.$events[name] = [];
  }

  if (!isArray(this.$events[name])) {
    this.$events[name] = [this.$events[name]];
  }

  return this.$events[name];
};

/**
 * Emits an event.
 *
 * @api public
 */

EventEmitter.prototype.emit = function (name) {
  if (!this.$events) {
    return false;
  }

  var handler = this.$events[name];

  if (!handler) {
    return false;
  }

  var args = [].slice.call(arguments, 1);

  if ('function' == typeof handler) {
    handler.apply(this, args);
  } else if (isArray(handler)) {
    var listeners = handler.slice();

    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
  } else {
    return false;
  }

  return true;
};
}); // module: browser/events.js

require.register("browser/fs.js", function(module, exports, require){

}); // module: browser/fs.js

require.register("browser/path.js", function(module, exports, require){

}); // module: browser/path.js

require.register("browser/progress.js", function(module, exports, require){

/**
 * Expose `Progress`.
 */

module.exports = Progress;

/**
 * Initialize a new `Progress` indicator.
 */

function Progress() {
  this.percent = 0;
  this.size(0);
  this.fontSize(11);
  this.font('helvetica, arial, sans-serif');
}

/**
 * Set progress size to `n`.
 *
 * @param {Number} n
 * @return {Progress} for chaining
 * @api public
 */

Progress.prototype.size = function(n){
  this._size = n;
  return this;
};

/**
 * Set text to `str`.
 *
 * @param {String} str
 * @return {Progress} for chaining
 * @api public
 */

Progress.prototype.text = function(str){
  this._text = str;
  return this;
};

/**
 * Set font size to `n`.
 *
 * @param {Number} n
 * @return {Progress} for chaining
 * @api public
 */

Progress.prototype.fontSize = function(n){
  this._fontSize = n;
  return this;
};

/**
 * Set font `family`.
 *
 * @param {String} family
 * @return {Progress} for chaining
 */

Progress.prototype.font = function(family){
  this._font = family;
  return this;
};

/**
 * Update percentage to `n`.
 *
 * @param {Number} n
 * @return {Progress} for chaining
 */

Progress.prototype.update = function(n){
  this.percent = n;
  return this;
};

/**
 * Draw on `ctx`.
 *
 * @param {CanvasRenderingContext2d} ctx
 * @return {Progress} for chaining
 */

Progress.prototype.draw = function(ctx){
  var percent = Math.min(this.percent, 100)
    , size = this._size
    , half = size / 2
    , x = half
    , y = half
    , rad = half - 1
    , fontSize = this._fontSize;

  ctx.font = fontSize + 'px ' + this._font;

  var angle = Math.PI * 2 * (percent / 100);
  ctx.clearRect(0, 0, size, size);

  // outer circle
  ctx.strokeStyle = '#9f9f9f';
  ctx.beginPath();
  ctx.arc(x, y, rad, 0, angle, false);
  ctx.stroke();

  // inner circle
  ctx.strokeStyle = '#eee';
  ctx.beginPath();
  ctx.arc(x, y, rad - 1, 0, angle, true);
  ctx.stroke();

  // text
  var text = this._text || (percent | 0) + '%'
    , w = ctx.measureText(text).width;

  ctx.fillText(
      text
    , x - w / 2 + 1
    , y + fontSize / 2 - 1);

  return this;
};

}); // module: browser/progress.js

require.register("browser/tty.js", function(module, exports, require){

exports.isatty = function(){
  return true;
};

exports.getWindowSize = function(){
  return [window.innerHeight, window.innerWidth];
};
}); // module: browser/tty.js

require.register("context.js", function(module, exports, require){

/**
 * Expose `Context`.
 */

module.exports = Context;

/**
 * Initialize a new `Context`.
 *
 * @api private
 */

function Context(){}

/**
 * Set the context `Runnable` to `runnable`.
 *
 * @param {Runnable} runnable
 * @return {Context}
 * @api private
 */

Context.prototype.runnable = function(runnable){
  this._runnable = runnable;
  return this;
};

/**
 * Set test timeout `ms`.
 *
 * @param {Number} ms
 * @return {Context} self
 * @api private
 */

Context.prototype.timeout = function(ms){
  this._runnable.timeout(ms);
  return this;
};

/**
 * Inspect the context void of `._runnable`.
 *
 * @return {String}
 * @api private
 */

Context.prototype.inspect = function(){
  return JSON.stringify(this, function(key, val){
    return '_runnable' == key
      ? undefined
      : val;
  }, 2);
};

}); // module: context.js

require.register("hook.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Runnable = require('./runnable');

/**
 * Expose `Hook`.
 */

module.exports = Hook;

/**
 * Initialize a new `Hook` with the given `title` and callback `fn`.
 *
 * @param {String} title
 * @param {Function} fn
 * @api private
 */

function Hook(title, fn) {
  Runnable.call(this, title, fn);
  this.type = 'hook';
}

/**
 * Inherit from `Runnable.prototype`.
 */

Hook.prototype = new Runnable;
Hook.prototype.constructor = Hook;


}); // module: hook.js

require.register("interfaces/bdd.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Suite = require('../suite')
  , Test = require('../test');

/**
 * BDD-style interface:
 * 
 *      describe('Array', function(){
 *        describe('#indexOf()', function(){
 *          it('should return -1 when not present', function(){
 *
 *          });
 *
 *          it('should return the index when present', function(){
 *
 *          });
 *        });
 *      });
 * 
 */

module.exports = function(suite){
  var suites = [suite];

  suite.on('pre-require', function(context){

    // noop variants

    context.xdescribe = function(){};
    context.xit = function(){};

    /**
     * Execute before running tests.
     */

    context.before = function(fn){
      suites[0].beforeAll(fn);
    };

    /**
     * Execute after running tests.
     */

    context.after = function(fn){
      suites[0].afterAll(fn);
    };

    /**
     * Execute before each test case.
     */

    context.beforeEach = function(fn){
      suites[0].beforeEach(fn);
    };

    /**
     * Execute after each test case.
     */

    context.afterEach = function(fn){
      suites[0].afterEach(fn);
    };

    /**
     * Describe a "suite" with the given `title`
     * and callback `fn` containing nested suites
     * and/or tests.
     */
  
    context.describe = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suites.unshift(suite);
      fn();
      suites.shift();
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.it = function(title, fn){
      suites[0].addTest(new Test(title, fn));
    };
  });
};

}); // module: interfaces/bdd.js

require.register("interfaces/exports.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Suite = require('../suite')
  , Test = require('../test');

/**
 * TDD-style interface:
 * 
 *     exports.Array = {
 *       '#indexOf()': {
 *         'should return -1 when the value is not present': function(){
 *           
 *         },
 *
 *         'should return the correct index when the value is present': function(){
 *           
 *         }
 *       }
 *     };
 * 
 */

module.exports = function(suite){
  var suites = [suite];

  suite.on('require', visit);

  function visit(obj) {
    var suite;
    for (var key in obj) {
      if ('function' == typeof obj[key]) {
        var fn = obj[key];
        switch (key) {
          case 'before':
            suites[0].beforeAll(fn);
            break;
          case 'after':
            suites[0].afterAll(fn);
            break;
          case 'beforeEach':
            suites[0].beforeEach(fn);
            break;
          case 'afterEach':
            suites[0].afterEach(fn);
            break;
          default:
            suites[0].addTest(new Test(key, fn));
        }
      } else {
        var suite = Suite.create(suites[0], key);
        suites.unshift(suite);
        visit(obj[key]);
        suites.shift();
      }
    }
  }
};
}); // module: interfaces/exports.js

require.register("interfaces/index.js", function(module, exports, require){

exports.bdd = require('./bdd');
exports.tdd = require('./tdd');
exports.qunit = require('./qunit');
exports.exports = require('./exports');

}); // module: interfaces/index.js

require.register("interfaces/qunit.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Suite = require('../suite')
  , Test = require('../test');

/**
 * QUnit-style interface:
 * 
 *     suite('Array');
 *     
 *     test('#length', function(){
 *       var arr = [1,2,3];
 *       ok(arr.length == 3);
 *     });
 *     
 *     test('#indexOf()', function(){
 *       var arr = [1,2,3];
 *       ok(arr.indexOf(1) == 0);
 *       ok(arr.indexOf(2) == 1);
 *       ok(arr.indexOf(3) == 2);
 *     });
 *     
 *     suite('String');
 *     
 *     test('#length', function(){
 *       ok('foo'.length == 3);
 *     });
 * 
 */

module.exports = function(suite){
  var suites = [suite];

  suite.on('pre-require', function(context){

    /**
     * Execute before running tests.
     */

    context.before = function(fn){
      suites[0].beforeAll(fn);
    };

    /**
     * Execute after running tests.
     */

    context.after = function(fn){
      suites[0].afterAll(fn);
    };

    /**
     * Execute before each test case.
     */

    context.beforeEach = function(fn){
      suites[0].beforeEach(fn);
    };

    /**
     * Execute after each test case.
     */

    context.afterEach = function(fn){
      suites[0].afterEach(fn);
    };

    /**
     * Describe a "suite" with the given `title`.
     */
  
    context.suite = function(title){
      if (suites.length > 1) suites.shift();
      var suite = Suite.create(suites[0], title);
      suites.unshift(suite);
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.test = function(title, fn){
      suites[0].addTest(new Test(title, fn));
    };
  });
};

}); // module: interfaces/qunit.js

require.register("interfaces/tdd.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Suite = require('../suite')
  , Test = require('../test');

/**
 * TDD-style interface:
 *
 *      suite('Array', function(){
 *        suite('#indexOf()', function(){
 *          suiteSetup(function(){
 *
 *          });
 *          
 *          test('should return -1 when not present', function(){
 *
 *          });
 *
 *          test('should return the index when present', function(){
 *
 *          });
 *
 *          suiteTeardown(function(){
 *
 *          });
 *        });
 *      });
 *
 */

module.exports = function(suite){
  var suites = [suite];

  suite.on('pre-require', function(context){

    /**
     * Execute before each test case.
     */

    context.setup = function(fn){
      suites[0].beforeEach(fn);
    };

    /**
     * Execute after each test case.
     */

    context.teardown = function(fn){
      suites[0].afterEach(fn);
    };

    /**
     * Execute before the suite.
     */

    context.suiteSetup = function(fn){
      suites[0].beforeAll(fn);
    };

    /**
     * Execute after the suite.
     */

    context.suiteTeardown = function(fn){
      suites[0].afterAll(fn);
    };

    /**
     * Describe a "suite" with the given `title`
     * and callback `fn` containing nested suites
     * and/or tests.
     */

    context.suite = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suites.unshift(suite);
      fn();
      suites.shift();
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.test = function(title, fn){
      suites[0].addTest(new Test(title, fn));
    };
  });
};

}); // module: interfaces/tdd.js

require.register("mocha.js", function(module, exports, require){

/*!
 * mocha
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var path = require('browser/path');

/**
 * Expose `Mocha`.
 */

exports = module.exports = Mocha;

/**
 * Library version.
 */

exports.version = '1.0.3';

/**
 * Expose internals.
 */

exports.utils = require('./utils');
exports.interfaces = require('./interfaces');
exports.reporters = require('./reporters');
exports.Runnable = require('./runnable');
exports.Context = require('./context');
exports.Runner = require('./runner');
exports.Suite = require('./suite');
exports.Hook = require('./hook');
exports.Test = require('./test');

/**
 * Return image `name` path.
 *
 * @param {String} name
 * @return {String}
 * @api private
 */

function image(name) {
  return __dirname + '/../images/' + name + '.png';
}

/**
 * Setup mocha with `options`.
 *
 * Options:
 *
 *   - `ui` name "bdd", "tdd", "exports" etc
 *   - `reporter` reporter instance, defaults to `mocha.reporters.Dot`
 *   - `globals` array of accepted globals
 *   - `timeout` timeout in milliseconds
 *   - `ignoreLeaks` ignore global leaks
 *   - `grep` string or regexp to filter tests with
 *
 * @param {Object} options
 * @api public
 */

function Mocha(options) {
  options = options || {};
  this.files = [];
  this.options = options;
  this.grep(options.grep);
  this.suite = new exports.Suite('', new exports.Context);
  this.ui(options.ui);
  this.reporter(options.reporter);
  if (options.timeout) this.suite.timeout(options.timeout);
}

/**
 * Add test `file`.
 *
 * @param {String} file
 * @api public
 */

Mocha.prototype.addFile = function(file){
  this.files.push(file);
  return this;
};

/**
 * Set reporter to `name`, defaults to "dot".
 *
 * @param {String} name
 * @api public
 */

Mocha.prototype.reporter = function(name){
  name = name || 'dot';
  this._reporter = require('./reporters/' + name);
  if (!this._reporter) throw new Error('invalid reporter "' + name + '"');
  return this;
};

/**
 * Set test UI `name`, defaults to "bdd".
 *
 * @param {String} bdd
 * @api public
 */

Mocha.prototype.ui = function(name){
  name = name || 'bdd';
  this._ui = exports.interfaces[name];
  if (!this._ui) throw new Error('invalid interface "' + name + '"');
  this._ui = this._ui(this.suite);
  return this;
};

/**
 * Load registered files.
 *
 * @api private
 */

Mocha.prototype.loadFiles = function(){
  var suite = this.suite;
  this.files.forEach(function(file){
    file = path.resolve(file);
    suite.emit('pre-require', global, file);
    suite.emit('require', require(file), file);
    suite.emit('post-require', global, file);
  });
};

/**
 * Enable growl support.
 *
 * @api private
 */

Mocha.prototype.growl = function(runner, reporter) {
  var notify = require('growl');

  runner.on('end', function(){
    var stats = reporter.stats;
    if (stats.failures) {
      var msg = stats.failures + ' of ' + runner.total + ' tests failed';
      notify(msg, { title: 'Failed', image: image('fail') });
    } else {
      notify(stats.passes + ' tests passed in ' + stats.duration + 'ms', {
          title: 'Passed'
        , image: image('pass')
      });
    }
  });
};

/**
 * Add regexp to grep for to the options object
 *
 * @param {RegExp} or {String} re
 * @return {Mocha}
 * @api public
 */

Mocha.prototype.grep = function(re){
  this.options.grep = 'string' == typeof re
    ? new RegExp(re)
    : re;
  return this;
};

/**
 * Run tests and invoke `fn()` when complete.
 *
 * @param {Function} fn
 * @return {Runner}
 * @api public
 */

Mocha.prototype.run = function(fn){
  this.loadFiles();
  var suite = this.suite;
  var options = this.options;
  var runner = new exports.Runner(suite);
  var reporter = new this._reporter(runner);
  runner.ignoreLeaks = options.ignoreLeaks;
  if (options.grep) runner.grep(options.grep);
  if (options.globals) runner.globals(options.globals);
  if (options.growl) this.growl(runner, reporter);
  return runner.run(fn);
};
}); // module: mocha.js

require.register("reporters/base.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var tty = require('browser/tty')
  , diff = require('browser/diff');

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

var Date = global.Date
  , setTimeout = global.setTimeout
  , setInterval = global.setInterval
  , clearTimeout = global.clearTimeout
  , clearInterval = global.clearInterval;

/**
 * Check if both stdio streams are associated with a tty.
 */

var isatty = tty.isatty(1) && tty.isatty(2);

/**
 * Expose `Base`.
 */

exports = module.exports = Base;

/**
 * Enable coloring by default.
 */

exports.useColors = isatty;

/**
 * Default color map.
 */

exports.colors = {
    'pass': 90
  , 'fail': 31
  , 'bright pass': 92
  , 'bright fail': 91
  , 'bright yellow': 93
  , 'pending': 36
  , 'suite': 0
  , 'error title': 0
  , 'error message': 31
  , 'error stack': 90
  , 'checkmark': 32
  , 'fast': 90
  , 'medium': 33
  , 'slow': 31
  , 'green': 32
  , 'light': 90
  , 'diff gutter': 90
  , 'diff added': 42
  , 'diff removed': 41
};

/**
 * Color `str` with the given `type`,
 * allowing colors to be disabled,
 * as well as user-defined color
 * schemes.
 *
 * @param {String} type
 * @param {String} str
 * @return {String}
 * @api private
 */

var color = exports.color = function(type, str) {
  if (!exports.useColors) return str;
  return '\033[' + exports.colors[type] + 'm' + str + '\033[0m';
};

/**
 * Expose term window size, with some
 * defaults for when stderr is not a tty.
 */

exports.window = {
  width: isatty
    ? process.stdout.getWindowSize
      ? process.stdout.getWindowSize(1)[0]
      : tty.getWindowSize()[1]
    : 75
};

/**
 * Expose some basic cursor interactions
 * that are common among reporters.
 */

exports.cursor = {
  hide: function(){
    process.stdout.write('\033[?25l');
  },

  show: function(){
    process.stdout.write('\033[?25h');
  },

  deleteLine: function(){
    process.stdout.write('\033[2K');
  },

  beginningOfLine: function(){
    process.stdout.write('\033[0G');
  },

  CR: function(){
    exports.cursor.deleteLine();
    exports.cursor.beginningOfLine();
  }
};

/**
 * A test is considered slow if it
 * exceeds the following value in milliseconds.
 */

exports.slow = 75;

/**
 * Outut the given `failures` as a list.
 *
 * @param {Array} failures
 * @api public
 */

exports.list = function(failures){
  console.error();
  failures.forEach(function(test, i){
    // format
    var fmt = color('error title', '  %s) %s:\n')
      + color('error message', '     %s')
      + color('error stack', '\n%s\n');

    // msg
    var err = test.err
      , message = err.message || ''
      , stack = err.stack || message
      , index = stack.indexOf(message) + message.length
      , msg = stack.slice(0, index)
      , actual = err.actual
      , expected = err.expected;

    // actual / expected diff
    if ('string' == typeof actual && 'string' == typeof expected) {
      var len = Math.max(actual.length, expected.length);

      if (len < 20) msg = errorDiff(err, 'Chars');
      else msg = errorDiff(err, 'Words');

      // linenos
      var lines = msg.split('\n');
      if (lines.length > 4) {
        var width = String(lines.length).length;
        msg = lines.map(function(str, i){
          return pad(++i, width) + ' |' + ' ' + str;
        }).join('\n');
      }

      // legend
      msg = '\n'
        + color('diff removed', 'actual')
        + ' '
        + color('diff added', 'expected')
        + '\n\n'
        + msg
        + '\n';

      // indent
      msg = msg.replace(/^/gm, '      ');

      fmt = color('error title', '  %s) %s:\n%s')
        + color('error stack', '\n%s\n');
    }

    // indent stack trace without msg
    stack = stack.slice(index ? index + 1 : index)
      .replace(/^/gm, '  ');

    console.error(fmt, (i + 1), test.fullTitle(), msg, stack);
  });
};

/**
 * Initialize a new `Base` reporter.
 *
 * All other reporters generally
 * inherit from this reporter, providing
 * stats such as test duration, number
 * of tests passed / failed etc.
 *
 * @param {Runner} runner
 * @api public
 */

function Base(runner) {
  var self = this
    , stats = this.stats = { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0 }
    , failures = this.failures = [];

  if (!runner) return;
  this.runner = runner;

  runner.on('start', function(){
    stats.start = new Date;
  });

  runner.on('suite', function(suite){
    stats.suites = stats.suites || 0;
    suite.root || stats.suites++;
  });

  runner.on('test end', function(test){
    stats.tests = stats.tests || 0;
    stats.tests++;
  });

  runner.on('pass', function(test){
    stats.passes = stats.passes || 0;

    var medium = exports.slow / 2;
    test.speed = test.duration > exports.slow
      ? 'slow'
      : test.duration > medium
        ? 'medium'
        : 'fast';

    stats.passes++;
  });

  runner.on('fail', function(test, err){
    stats.failures = stats.failures || 0;
    stats.failures++;
    test.err = err;
    failures.push(test);
  });

  runner.on('end', function(){
    stats.end = new Date;
    stats.duration = new Date - stats.start;
  });

  runner.on('pending', function(){
    stats.pending++;
  });
}

/**
 * Output common epilogue used by many of
 * the bundled reporters.
 *
 * @api public
 */

Base.prototype.epilogue = function(){
  var stats = this.stats
    , fmt
    , tests;

  console.log();

  function pluralize(n) {
    return 1 == n ? 'test' : 'tests';
  }

  // failure
  if (stats.failures) {
    fmt = color('bright fail', '  ✖')
      + color('fail', ' %d of %d %s failed')
      + color('light', ':')

    console.error(fmt,
      stats.failures,
      this.runner.total,
      pluralize(this.runner.total));

    Base.list(this.failures);
    console.error();
    return;
  }

  // pass
  fmt = color('bright pass', '  ✔')
    + color('green', ' %d %s complete')
    + color('light', ' (%dms)');

  console.log(fmt,
    stats.tests || 0,
    pluralize(stats.tests),
    stats.duration);

  // pending
  if (stats.pending) {
    fmt = color('pending', '  •')
      + color('pending', ' %d %s pending');

    console.log(fmt, stats.pending, pluralize(stats.pending));
  }

  console.log();
};

/**
 * Pad the given `str` to `len`.
 *
 * @param {String} str
 * @param {String} len
 * @return {String}
 * @api private
 */

function pad(str, len) {
  str = String(str);
  return Array(len - str.length + 1).join(' ') + str;
}

/**
 * Return a character diff for `err`.
 *
 * @param {Error} err
 * @return {String}
 * @api private
 */

function errorDiff(err, type) {
  return diff['diff' + type](err.actual, err.expected).map(function(str){
    if (/^(\n+)$/.test(str.value)) str.value = Array(++RegExp.$1.length).join('<newline>');
    if (str.added) return colorLines('diff added', str.value);
    if (str.removed) return colorLines('diff removed', str.value);
    return str.value;
  }).join('');
}

/**
 * Color lines for `str`, using the color `name`.
 *
 * @param {String} name
 * @param {String} str
 * @return {String}
 * @api private
 */

function colorLines(name, str) {
  return str.split('\n').map(function(str){
    return color(name, str);
  }).join('\n');
}

}); // module: reporters/base.js

require.register("reporters/doc.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils');

/**
 * Expose `Doc`.
 */

exports = module.exports = Doc;

/**
 * Initialize a new `Doc` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Doc(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total
    , indents = 2;

  function indent() {
    return Array(indents).join('  ');
  }

  runner.on('suite', function(suite){
    if (suite.root) return;
    ++indents;
    console.log('%s<section class="suite">', indent());
    ++indents;
    console.log('%s<h1>%s</h1>', indent(), suite.title);
    console.log('%s<dl>', indent());
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    console.log('%s</dl>', indent());
    --indents;
    console.log('%s</section>', indent());
    --indents;
  });

  runner.on('pass', function(test){
    console.log('%s  <dt>%s</dt>', indent(), test.title);
    var code = utils.escape(clean(test.fn.toString()));
    console.log('%s  <dd><pre><code>%s</code></pre></dd>', indent(), code);
  });
}

/**
 * Strip the function definition from `str`,
 * and re-indent for pre whitespace.
 */

function clean(str) {
  str = str
    .replace(/^function *\(.*\) *{/, '')
    .replace(/\s+\}$/, '');

  var spaces = str.match(/^\n?( *)/)[1].length
    , re = new RegExp('^ {' + spaces + '}', 'gm');

  str = str.replace(re, '');

  return str;
}
}); // module: reporters/doc.js

require.register("reporters/dot.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , color = Base.color;

/**
 * Expose `Dot`.
 */

exports = module.exports = Dot;

/**
 * Initialize a new `Dot` matrix test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Dot(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , width = Base.window.width * .75 | 0
    , n = 0;

  runner.on('start', function(){
    process.stdout.write('\n  ');
  });

  runner.on('pending', function(test){
    process.stdout.write(color('pending', '.'));
  });

  runner.on('pass', function(test){
    if (++n % width == 0) process.stdout.write('\n  ');
    if ('slow' == test.speed) {
      process.stdout.write(color('bright yellow', '.'));
    } else {
      process.stdout.write(color(test.speed, '.'));
    }
  });

  runner.on('fail', function(test, err){
    if (++n % width == 0) process.stdout.write('\n  ');
    process.stdout.write(color('fail', '.'));
  });

  runner.on('end', function(){
    console.log();
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */

Dot.prototype = new Base;
Dot.prototype.constructor = Dot;

}); // module: reporters/dot.js

require.register("reporters/html-cov.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var JSONCov = require('./json-cov')
  , fs = require('browser/fs');

/**
 * Expose `HTMLCov`.
 */

exports = module.exports = HTMLCov;

/**
 * Initialize a new `JsCoverage` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function HTMLCov(runner) {
  var jade = require('jade')
    , file = __dirname + '/templates/coverage.jade'
    , str = fs.readFileSync(file, 'utf8')
    , fn = jade.compile(str, { filename: file })
    , self = this;

  JSONCov.call(this, runner, false);

  runner.on('end', function(){
    process.stdout.write(fn({
        cov: self.cov
      , coverageClass: coverageClass
    }));
  });
}

function coverageClass(n) {
  if (n >= 75) return 'high';
  if (n >= 50) return 'medium';
  if (n >= 25) return 'low';
  return 'terrible';
}
}); // module: reporters/html-cov.js

require.register("reporters/html.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils')
  , Progress = require('../browser/progress')
  , escape = utils.escape;

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

var Date = global.Date
  , setTimeout = global.setTimeout
  , setInterval = global.setInterval
  , clearTimeout = global.clearTimeout
  , clearInterval = global.clearInterval;

/**
 * Expose `Doc`.
 */

exports = module.exports = HTML;

/**
 * Stats template.
 */

var statsTemplate = '<ul id="stats">'
  + '<li class="progress"><canvas width="40" height="40"></canvas></li>'
  + '<li class="passes">passes: <em>0</em></li>'
  + '<li class="failures">failures: <em>0</em></li>'
  + '<li class="duration">duration: <em>0</em>s</li>'
  + '</ul>';

/**
 * Initialize a new `Doc` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function HTML(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total
    , root = document.getElementById('mocha')
    , stat = fragment(statsTemplate)
    , items = stat.getElementsByTagName('li')
    , passes = items[1].getElementsByTagName('em')[0]
    , failures = items[2].getElementsByTagName('em')[0]
    , duration = items[3].getElementsByTagName('em')[0]
    , canvas = stat.getElementsByTagName('canvas')[0]
    , report = fragment('<ul id="report"></ul>')
    , stack = [report]
    , progress
    , ctx

  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
    progress = new Progress;
  }

  if (!root) return error('#mocha div missing, add it to your document');

  root.appendChild(stat);
  root.appendChild(report);

  if (progress) progress.size(40);

  runner.on('suite', function(suite){
    if (suite.root) return;

    // suite
    var el = fragment('<li class="suite"><h1>%s</h1></li>', suite.title);

    // container
    stack[0].appendChild(el);
    stack.unshift(document.createElement('ul'));
    el.appendChild(stack[0]);
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    stack.shift();
  });

  runner.on('fail', function(test, err){
    if ('hook' == test.type || err.uncaught) runner.emit('test end', test);
  });

  runner.on('test end', function(test){
    // TODO: add to stats
    var percent = stats.tests / total * 100 | 0;
    if (progress) progress.update(percent).draw(ctx);

    // update stats
    var ms = new Date - stats.start;
    text(passes, stats.passes);
    text(failures, stats.failures);
    text(duration, (ms / 1000).toFixed(2));

    // test
    if ('passed' == test.state) {
      var el = fragment('<li class="test pass %e"><h2>%e<span class="duration">%ems</span></h2></li>', test.speed, test.title, test.duration);
    } else if (test.pending) {
      var el = fragment('<li class="test pass pending"><h2>%e</h2></li>', test.title);
    } else {
      var el = fragment('<li class="test fail"><h2>%e</h2></li>', test.title);
      var str = test.err.stack || test.err.toString();

      // FF / Opera do not add the message
      if (!~str.indexOf(test.err.message)) {
        str = test.err.message + '\n' + str;
      }

      // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we
      // check for the result of the stringifying.
      if ('[object Error]' == str) str = test.err.message;

      // Safari doesn't give you a stack. Let's at least provide a source line.
      if (!test.err.stack && test.err.sourceURL && test.err.line !== undefined) {
        str += "\n(" + test.err.sourceURL + ":" + test.err.line + ")";
      }

      el.appendChild(fragment('<pre class="error">%e</pre>', str));
    }

    // toggle code
    var h2 = el.getElementsByTagName('h2')[0];

    on(h2, 'click', function(){
      pre.style.display = 'none' == pre.style.display
        ? 'block'
        : 'none';
    });

    // code
    // TODO: defer
    if (!test.pending) {
      var pre = fragment('<pre><code>%e</code></pre>', clean(test.fn.toString()));
      el.appendChild(pre);
      pre.style.display = 'none';
    }

    stack[0].appendChild(el);
  });
}

/**
 * Display error `msg`.
 */

function error(msg) {
  document.body.appendChild(fragment('<div id="error">%s</div>', msg));
}

/**
 * Return a DOM fragment from `html`.
 */

function fragment(html) {
  var args = arguments
    , div = document.createElement('div')
    , i = 1;

  div.innerHTML = html.replace(/%([se])/g, function(_, type){
    switch (type) {
      case 's': return String(args[i++]);
      case 'e': return escape(args[i++]);
    }
  });

  return div.firstChild;
}

/**
 * Set `el` text to `str`.
 */

function text(el, str) {
  if (el.textContent) {
    el.textContent = str;
  } else {
    el.innerText = str;
  }
}

/**
 * Listen on `event` with callback `fn`.
 */

function on(el, event, fn) {
  if (el.addEventListener) {
    el.addEventListener(event, fn, false);
  } else {
    el.attachEvent('on' + event, fn);
  }
}

/**
 * Strip the function definition from `str`,
 * and re-indent for pre whitespace.
 */

function clean(str) {
  str = str
    .replace(/^function *\(.*\) *{/, '')
    .replace(/\s+\}$/, '');

  var spaces = str.match(/^\n?( *)/)[1].length
    , re = new RegExp('^ {' + spaces + '}', 'gm');

  str = str
    .replace(re, '')
    .replace(/^\s+/, '');

  return str;
}

}); // module: reporters/html.js

require.register("reporters/index.js", function(module, exports, require){

exports.Base = require('./base');
exports.Dot = require('./dot');
exports.Doc = require('./doc');
exports.TAP = require('./tap');
exports.JSON = require('./json');
exports.HTML = require('./html');
exports.List = require('./list');
exports.Min = require('./min');
exports.Spec = require('./spec');
exports.Progress = require('./progress');
exports.Landing = require('./landing');
exports.JSONCov = require('./json-cov');
exports.HTMLCov = require('./html-cov');
exports.JSONStream = require('./json-stream');
exports.XUnit = require('./xunit')
exports.Teamcity = require('./teamcity')

}); // module: reporters/index.js

require.register("reporters/json-cov.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `JSONCov`.
 */

exports = module.exports = JSONCov;

/**
 * Initialize a new `JsCoverage` reporter.
 *
 * @param {Runner} runner
 * @param {Boolean} output
 * @api public
 */

function JSONCov(runner, output) {
  var self = this
    , output = 1 == arguments.length ? true : output;

  Base.call(this, runner);

  var tests = []
    , failures = []
    , passes = [];

  runner.on('test end', function(test){
    tests.push(test);
  });

  runner.on('pass', function(test){
    passes.push(test);
  });

  runner.on('fail', function(test){
    failures.push(test);
  });

  runner.on('end', function(){
    var cov = global._$jscoverage || {};
    var result = self.cov = map(cov);
    result.stats = self.stats;
    result.tests = tests.map(clean);
    result.failures = failures.map(clean);
    result.passes = passes.map(clean);
    if (!output) return;
    process.stdout.write(JSON.stringify(result, null, 2 ));
  });
}

/**
 * Map jscoverage data to a JSON structure
 * suitable for reporting.
 *
 * @param {Object} cov
 * @return {Object}
 * @api private
 */

function map(cov) {
  var ret = {
      instrumentation: 'node-jscoverage'
    , sloc: 0
    , hits: 0
    , misses: 0
    , coverage: 0
    , files: []
  };

  for (var filename in cov) {
    var data = coverage(filename, cov[filename]);
    ret.files.push(data);
    ret.hits += data.hits;
    ret.misses += data.misses;
    ret.sloc += data.sloc;
  }

  if (ret.sloc > 0) {
    ret.coverage = (ret.hits / ret.sloc) * 100;
  }

  return ret;
};

/**
 * Map jscoverage data for a single source file
 * to a JSON structure suitable for reporting.
 *
 * @param {String} filename name of the source file
 * @param {Object} data jscoverage coverage data
 * @return {Object}
 * @api private
 */

function coverage(filename, data) {
  var ret = {
    filename: filename,
    coverage: 0,
    hits: 0,
    misses: 0,
    sloc: 0,
    source: {}
  };

  data.source.forEach(function(line, num){
    num++;

    if (data[num] === 0) {
      ret.misses++;
      ret.sloc++;
    } else if (data[num] !== undefined) {
      ret.hits++;
      ret.sloc++;
    }

    ret.source[num] = {
        source: line
      , coverage: data[num] === undefined
        ? ''
        : data[num]
    };
  });

  ret.coverage = ret.hits / ret.sloc * 100;

  return ret;
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @param {Object} test
 * @return {Object}
 * @api private
 */

function clean(test) {
  return {
      title: test.title
    , fullTitle: test.fullTitle()
    , duration: test.duration
  }
}

}); // module: reporters/json-cov.js

require.register("reporters/json-stream.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , color = Base.color;

/**
 * Expose `List`.
 */

exports = module.exports = List;

/**
 * Initialize a new `List` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function List(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total;

  runner.on('start', function(){
    console.log(JSON.stringify(['start', { total: total }]));
  });

  runner.on('pass', function(test){
    console.log(JSON.stringify(['pass', clean(test)]));
  });

  runner.on('fail', function(test, err){
    console.log(JSON.stringify(['fail', clean(test)]));
  });

  runner.on('end', function(){
    process.stdout.write(JSON.stringify(['end', self.stats]));
  });
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @param {Object} test
 * @return {Object}
 * @api private
 */

function clean(test) {
  return {
      title: test.title
    , fullTitle: test.fullTitle()
    , duration: test.duration
  }
}
}); // module: reporters/json-stream.js

require.register("reporters/json.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `JSON`.
 */

exports = module.exports = JSONReporter;

/**
 * Initialize a new `JSON` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function JSONReporter(runner) {
  var self = this;
  Base.call(this, runner);

  var tests = []
    , failures = []
    , passes = [];

  runner.on('test end', function(test){
    tests.push(test);
  });

  runner.on('pass', function(test){
    passes.push(test);
  });

  runner.on('fail', function(test){
    failures.push(test);
  });

  runner.on('end', function(){
    var obj = {
        stats: self.stats
      , tests: tests.map(clean)
      , failures: failures.map(clean)
      , passes: passes.map(clean)
    };

    process.stdout.write(JSON.stringify(obj, null, 2));
  });
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @param {Object} test
 * @return {Object}
 * @api private
 */

function clean(test) {
  return {
      title: test.title
    , fullTitle: test.fullTitle()
    , duration: test.duration
  }
}
}); // module: reporters/json.js

require.register("reporters/landing.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `Landing`.
 */

exports = module.exports = Landing;

/**
 * Airplane color.
 */

Base.colors.plane = 0;

/**
 * Airplane crash color.
 */

Base.colors['plane crash'] = 31;

/**
 * Runway color.
 */

Base.colors.runway = 90;

/**
 * Initialize a new `Landing` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Landing(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , width = Base.window.width * .75 | 0
    , total = runner.total
    , stream = process.stdout
    , plane = color('plane', '✈')
    , crashed = -1
    , n = 0;

  function runway() {
    var buf = Array(width).join('-');
    return '  ' + color('runway', buf);
  }

  runner.on('start', function(){
    stream.write('\n  ');
    cursor.hide();
  });

  runner.on('test end', function(test){
    // check if the plane crashed
    var col = -1 == crashed
      ? width * ++n / total | 0
      : crashed;

    // show the crash
    if ('failed' == test.state) {
      plane = color('plane crash', '✈');
      crashed = col;
    }

    // render landing strip
    stream.write('\033[4F\n\n');
    stream.write(runway());
    stream.write('\n  ');
    stream.write(color('runway', Array(col).join('⋅')));
    stream.write(plane)
    stream.write(color('runway', Array(width - col).join('⋅') + '\n'));
    stream.write(runway());
    stream.write('\033[0m');
  });

  runner.on('end', function(){
    cursor.show();
    console.log();
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */

Landing.prototype = new Base;
Landing.prototype.constructor = Landing;

}); // module: reporters/landing.js

require.register("reporters/list.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `List`.
 */

exports = module.exports = List;

/**
 * Initialize a new `List` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function List(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , n = 0;

  runner.on('start', function(){
    console.log();
  });

  runner.on('test', function(test){
    process.stdout.write(color('pass', '    ' + test.fullTitle() + ': '));
  });

  runner.on('pending', function(test){
    var fmt = color('checkmark', '  -')
      + color('pending', ' %s');
    console.log(fmt, test.fullTitle());
  });

  runner.on('pass', function(test){
    var fmt = color('checkmark', '  ✓')
      + color('pass', ' %s: ')
      + color(test.speed, '%dms');
    cursor.CR();
    console.log(fmt, test.fullTitle(), test.duration);
  });

  runner.on('fail', function(test, err){
    cursor.CR();
    console.log(color('fail', '  %d) %s'), ++n, test.fullTitle());
  });

  runner.on('end', self.epilogue.bind(self));
}

/**
 * Inherit from `Base.prototype`.
 */

List.prototype = new Base;
List.prototype.constructor = List;


}); // module: reporters/list.js

require.register("reporters/markdown.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils');

/**
 * Expose `Markdown`.
 */

exports = module.exports = Markdown;

/**
 * Initialize a new `Markdown` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Markdown(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total
    , level = 0
    , buf = '';

  function title(str) {
    return Array(level).join('#') + ' ' + str;
  }

  function indent() {
    return Array(level).join('  ');
  }

  function mapTOC(suite, obj) {
    var ret = obj;
    obj = obj[suite.title] = obj[suite.title] || { suite: suite };
    suite.suites.forEach(function(suite){
      mapTOC(suite, obj);
    });
    return ret;
  }

  function stringifyTOC(obj, level) {
    ++level;
    var buf = '';
    var link;
    for (var key in obj) {
      if ('suite' == key) continue;
      if (key) link = ' - [' + key + '](#' + utils.slug(obj[key].suite.fullTitle()) + ')\n';
      if (key) buf += Array(level).join('  ') + link;
      buf += stringifyTOC(obj[key], level);
    }
    --level;
    return buf;
  }

  function generateTOC(suite) {
    var obj = mapTOC(suite, {});
    return stringifyTOC(obj, 0);
  }

  generateTOC(runner.suite);

  runner.on('suite', function(suite){
    ++level;
    var slug = utils.slug(suite.fullTitle());
    buf += '<a name="' + slug + '" />' + '\n';
    buf += title(suite.title) + '\n';
  });

  runner.on('suite end', function(suite){
    --level;
  });

  runner.on('pass', function(test){
    var code = clean(test.fn.toString());
    buf += test.title + '.\n';
    buf += '\n```js';
    buf += code + '\n';
    buf += '```\n\n';
  });

  runner.on('end', function(){
    process.stdout.write('# TOC\n');
    process.stdout.write(generateTOC(runner.suite));
    process.stdout.write(buf);
  });
}

/**
 * Strip the function definition from `str`,
 * and re-indent for pre whitespace.
 */

function clean(str) {
  str = str
    .replace(/^function *\(.*\) *{/, '')
    .replace(/\s+\}$/, '');

  var spaces = str.match(/^\n?( *)/)[1].length
    , re = new RegExp('^ {' + spaces + '}', 'gm');

  str = str.replace(re, '');

  return str;
}
}); // module: reporters/markdown.js

require.register("reporters/min.js", function(module, exports, require){
/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `Min`.
 */

exports = module.exports = Min;

/**
 * Initialize a new `Min` minimal test reporter (best used with --watch).
 *
 * @param {Runner} runner
 * @api public
 */

function Min(runner) {
  Base.call(this, runner);
  
  runner.on('start', function(){
    // clear screen
    process.stdout.write('\033[2J');
    // set cursor position
    process.stdout.write('\033[1;3H');
  });

  runner.on('end', this.epilogue.bind(this));
}

/**
 * Inherit from `Base.prototype`.
 */

Min.prototype = new Base;
Min.prototype.constructor = Min;

}); // module: reporters/min.js

require.register("reporters/progress.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `Progress`.
 */

exports = module.exports = Progress;

/**
 * General progress bar color.
 */

Base.colors.progress = 90;

/**
 * Initialize a new `Progress` bar test reporter.
 *
 * @param {Runner} runner
 * @param {Object} options
 * @api public
 */

function Progress(runner, options) {
  Base.call(this, runner);

  var self = this
    , options = options || {}
    , stats = this.stats
    , width = Base.window.width * .50 | 0
    , total = runner.total
    , complete = 0
    , max = Math.max;

  // default chars
  options.open = options.open || '[';
  options.complete = options.complete || '▬';
  options.incomplete = options.incomplete || '⋅';
  options.close = options.close || ']';
  options.verbose = false;

  // tests started
  runner.on('start', function(){
    console.log();
    cursor.hide();
  });

  // tests complete
  runner.on('test end', function(){
    complete++;
    var incomplete = total - complete
      , percent = complete / total
      , n = width * percent | 0
      , i = width - n;

    cursor.CR();
    process.stdout.write('\033[J');
    process.stdout.write(color('progress', '  ' + options.open));
    process.stdout.write(Array(n).join(options.complete));
    process.stdout.write(Array(i).join(options.incomplete));
    process.stdout.write(color('progress', options.close));
    if (options.verbose) {
      process.stdout.write(color('progress', ' ' + complete + ' of ' + total));
    }
  });

  // tests are complete, output some stats
  // and the failures if any
  runner.on('end', function(){
    cursor.show();
    console.log();
    self.epilogue();
  });
}

/**
 * Inherit from `Base.prototype`.
 */

Progress.prototype = new Base;
Progress.prototype.constructor = Progress;


}); // module: reporters/progress.js

require.register("reporters/spec.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `Spec`.
 */

exports = module.exports = Spec;

/**
 * Initialize a new `Spec` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Spec(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , indents = 0
    , n = 0;

  function indent() {
    return Array(indents).join('  ')
  }

  runner.on('start', function(){
    console.log();
  });

  runner.on('suite', function(suite){
    ++indents;
    console.log(color('suite', '%s%s'), indent(), suite.title);
  });

  runner.on('suite end', function(suite){
    --indents;
    if (1 == indents) console.log();
  });

  runner.on('test', function(test){
    process.stdout.write(indent() + color('pass', '  ◦ ' + test.title + ': '));
  });

  runner.on('pending', function(test){
    var fmt = indent() + color('pending', '  - %s');
    console.log(fmt, test.title);
  });

  runner.on('pass', function(test){
    if ('fast' == test.speed) {
      var fmt = indent()
        + color('checkmark', '  ✓')
        + color('pass', ' %s ');
      cursor.CR();
      console.log(fmt, test.title);
    } else {
      var fmt = indent()
        + color('checkmark', '  ✓')
        + color('pass', ' %s ')
        + color(test.speed, '(%dms)');
      cursor.CR();
      console.log(fmt, test.title, test.duration);
    }
  });

  runner.on('fail', function(test, err){
    cursor.CR();
    console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
  });

  runner.on('end', self.epilogue.bind(self));
}

/**
 * Inherit from `Base.prototype`.
 */

Spec.prototype = new Base;
Spec.prototype.constructor = Spec;


}); // module: reporters/spec.js

require.register("reporters/tap.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `TAP`.
 */

exports = module.exports = TAP;

/**
 * Initialize a new `TAP` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function TAP(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total
    , n = 1;

  runner.on('start', function(){
    console.log('%d..%d', 1, total);
  });

  runner.on('test end', function(){
    ++n;
  });

  runner.on('pending', function(test){
    console.log('ok %d %s # SKIP -', n, title(test));
  });

  runner.on('pass', function(test){
    console.log('ok %d %s', n, title(test));
  });

  runner.on('fail', function(test, err){
    console.log('not ok %d %s', n, title(test));
    console.log(err.stack.replace(/^/gm, '  '));
  });
}

/**
 * Return a TAP-safe title of `test`
 *
 * @param {Object} test
 * @return {String}
 * @api private
 */

function title(test) {
  return test.fullTitle().replace(/#/g, '');
}

}); // module: reporters/tap.js

require.register("reporters/teamcity.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `Teamcity`.
 */

exports = module.exports = Teamcity;

/**
 * Initialize a new `Teamcity` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Teamcity(runner) {
  Base.call(this, runner);
  var stats = this.stats;

  runner.on('start', function() {
    console.log("##teamcity[testSuiteStarted name='mocha.suite']");
  });

  runner.on('test', function(test) {
    console.log("##teamcity[testStarted name='" + escape(test.fullTitle()) + "']");
  });

  runner.on('fail', function(test, err) {
    console.log("##teamcity[testFailed name='" + escape(test.fullTitle()) + "' message='" + escape(err.message) + "']");
  });

  runner.on('pending', function(test) {
    console.log("##teamcity[testIgnored name='" + escape(test.fullTitle()) + "' message='pending']");
  });

  runner.on('test end', function(test) {
    console.log("##teamcity[testFinished name='" + escape(test.fullTitle()) + "' duration='" + test.duration + "']");
  });

  runner.on('end', function() {
    console.log("##teamcity[testSuiteFinished name='mocha.suite' duration='" + stats.duration + "']");
  });
}

/**
 * Escape the given `str`.
 */

function escape(str) {
  return str
    .replace(/\|/g, "||")
    .replace(/\n/g, "|n")
    .replace(/\r/g, "|r")
    .replace(/\[/g, "|[")
    .replace(/\]/g, "|]")
    .replace(/\u0085/g, "|x")
    .replace(/\u2028/g, "|l")
    .replace(/\u2029/g, "|p")
    .replace(/'/g, "|'");
}

}); // module: reporters/teamcity.js

require.register("reporters/xunit.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Base = require('./base')
  , utils = require('../utils')
  , escape = utils.escape;

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

var Date = global.Date
  , setTimeout = global.setTimeout
  , setInterval = global.setInterval
  , clearTimeout = global.clearTimeout
  , clearInterval = global.clearInterval;

/**
 * Expose `XUnit`.
 */

exports = module.exports = XUnit;

/**
 * Initialize a new `XUnit` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function XUnit(runner) {
  Base.call(this, runner);
  var stats = this.stats
    , tests = []
    , self = this;

  runner.on('test end', function(test){
    tests.push(test);
  });

  runner.on('end', function(){
    console.log(tag('testsuite', {
        name: 'Mocha Tests'
      , tests: stats.tests
      , failures: stats.failures
      , errors: stats.failures
      , skip: stats.tests - stats.failures - stats.passes
      , timestamp: (new Date).toUTCString()
      , time: stats.duration / 1000
    }, false));

    tests.forEach(test);
    console.log('</testsuite>');    
  });
}

/**
 * Inherit from `Base.prototype`.
 */

XUnit.prototype = new Base;
XUnit.prototype.constructor = XUnit;


/**
 * Output tag for the given `test.`
 */

function test(test) {
  var attrs = {
      classname: test.parent.fullTitle()
    , name: test.title
    , time: test.duration / 1000
  };

  if ('failed' == test.state) {
    var err = test.err;
    attrs.message = escape(err.message);
    console.log(tag('testcase', attrs, false, tag('failure', attrs, false, cdata(err.stack))));
  } else if (test.pending) {
    console.log(tag('testcase', attrs, false, tag('skipped', {}, true)));
  } else {
    console.log(tag('testcase', attrs, true) );
  }
}

/**
 * HTML tag helper.
 */

function tag(name, attrs, close, content) {
  var end = close ? '/>' : '>'
    , pairs = []
    , tag;

  for (var key in attrs) {
    pairs.push(key + '="' + escape(attrs[key]) + '"');
  }

  tag = '<' + name + (pairs.length ? ' ' + pairs.join(' ') : '') + end;
  if (content) tag += content + '</' + name + end;
  return tag;
}

/**
 * Return cdata escaped CDATA `str`.
 */

function cdata(str) {
  return '<![CDATA[' + escape(str) + ']]>';
}

}); // module: reporters/xunit.js

require.register("runnable.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var EventEmitter = require('browser/events').EventEmitter
  , debug = require('browser/debug')('runnable');

/**
 * Save timer references to avoid Sinon interfering (see GH-237).
 */

var Date = global.Date
  , setTimeout = global.setTimeout
  , setInterval = global.setInterval
  , clearTimeout = global.clearTimeout
  , clearInterval = global.clearInterval;

/**
 * Expose `Runnable`.
 */

module.exports = Runnable;

/**
 * Initialize a new `Runnable` with the given `title` and callback `fn`.
 *
 * @param {String} title
 * @param {Function} fn
 * @api private
 */

function Runnable(title, fn) {
  this.title = title;
  this.fn = fn;
  this.async = fn && fn.length;
  this.sync = ! this.async;
  this._timeout = 2000;
  this.timedOut = false;
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Runnable.prototype = new EventEmitter;
Runnable.prototype.constructor = Runnable;


/**
 * Set & get timeout `ms`.
 *
 * @param {Number} ms
 * @return {Runnable|Number} ms or self
 * @api private
 */

Runnable.prototype.timeout = function(ms){
  if (0 == arguments.length) return this._timeout;
  debug('timeout %d', ms);
  this._timeout = ms;
  if (this.timer) this.resetTimeout();
  return this;
};

/**
 * Return the full title generated by recursively
 * concatenating the parent's full title.
 *
 * @return {String}
 * @api public
 */

Runnable.prototype.fullTitle = function(){
  return this.parent.fullTitle() + ' ' + this.title;
};

/**
 * Clear the timeout.
 *
 * @api private
 */

Runnable.prototype.clearTimeout = function(){
  clearTimeout(this.timer);
};

/**
 * Reset the timeout.
 *
 * @api private
 */

Runnable.prototype.resetTimeout = function(){
  var self = this
    , ms = this.timeout();

  this.clearTimeout();
  if (ms) {
    this.timer = setTimeout(function(){
      self.callback(new Error('timeout of ' + ms + 'ms exceeded'));
      self.timedOut = true;
    }, ms);
  }
};

/**
 * Run the test and invoke `fn(err)`.
 *
 * @param {Function} fn
 * @api private
 */

Runnable.prototype.run = function(fn){
  var self = this
    , ms = this.timeout()
    , start = new Date
    , ctx = this.ctx
    , finished
    , emitted;

  if (ctx) ctx.runnable(this);

  // timeout
  if (this.async) {
    if (ms) {
      this.timer = setTimeout(function(){
        done(new Error('timeout of ' + ms + 'ms exceeded'));
        self.timedOut = true;
      }, ms);
    }
  }

  // called multiple times
  function multiple() {
    if (emitted) return;
    emitted = true;
    self.emit('error', new Error('done() called multiple times'));
  }

  // finished
  function done(err) {
    if (self.timedOut) return;
    if (finished) return multiple();
    self.clearTimeout();
    self.duration = new Date - start;
    finished = true;
    fn(err);
  }

  // for .resetTimeout()
  this.callback = done;

  // async
  if (this.async) {
    try {
      this.fn.call(ctx, function(err){
        if (err instanceof Error) return done(err);
        if (null != err) return done(new Error('done() invoked with non-Error: ' + err));
        done();
      });
    } catch (err) {
      done(err);
    }
    return;
  }
  
  // sync
  try {
    if (!this.pending) this.fn.call(ctx);
    this.duration = new Date - start;
    fn();
  } catch (err) {
    fn(err);
  }
};

}); // module: runnable.js

require.register("runner.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var EventEmitter = require('browser/events').EventEmitter
  , debug = require('browser/debug')('runner')
  , Test = require('./test')
  , utils = require('./utils')
  , noop = function(){};

/**
 * Expose `Runner`.
 */

module.exports = Runner;

/**
 * Initialize a `Runner` for the given `suite`.
 *
 * Events:
 *
 *   - `start`  execution started
 *   - `end`  execution complete
 *   - `suite`  (suite) test suite execution started
 *   - `suite end`  (suite) all tests (and sub-suites) have finished
 *   - `test`  (test) test execution started
 *   - `test end`  (test) test completed
 *   - `hook`  (hook) hook execution started
 *   - `hook end`  (hook) hook complete
 *   - `pass`  (test) test passed
 *   - `fail`  (test, err) test failed
 *
 * @api public
 */

function Runner(suite) {
  var self = this;
  this._globals = [];
  this.suite = suite;
  this.total = suite.total();
  this.failures = 0;
  this.on('test end', function(test){ self.checkGlobals(test); });
  this.on('hook end', function(hook){ self.checkGlobals(hook); });
  this.grep(/.*/);
  this.globals(utils.keys(global).concat(['errno']));
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Runner.prototype = new EventEmitter;
Runner.prototype.constructor = Runner;


/**
 * Run tests with full titles matching `re`. Updates runner.total
 * with number of tests matched.
 *
 * @param {RegExp} re
 * @return {Runner} for chaining
 * @api public
 */

Runner.prototype.grep = function(re){
  debug('grep %s', re);
  this._grep = re;
  this.total = this.grepTotal(this.suite);
  return this;
};

/**
 * Returns the number of tests matching the grep search for the 
 * given suite.
 *
 * @param {Suite} suite
 * @return {Number}
 * @api public
 */

Runner.prototype.grepTotal = function(suite) {
  var self = this;
  var total = 0;

  suite.eachTest(function(test){
    if (self._grep.test(test.fullTitle())) total++;
  });

  return total;
};

/**
 * Allow the given `arr` of globals.
 *
 * @param {Array} arr
 * @return {Runner} for chaining
 * @api public
 */

Runner.prototype.globals = function(arr){
  if (0 == arguments.length) return this._globals;
  debug('globals %j', arr);
  utils.forEach(arr, function(arr){
    this._globals.push(arr);
  }, this);
  return this;
};

/**
 * Check for global variable leaks.
 *
 * @api private
 */

Runner.prototype.checkGlobals = function(test){
  if (this.ignoreLeaks) return;

  var leaks = utils.filter(utils.keys(global), function(key){
    return !~utils.indexOf(this._globals, key) && (!global.navigator || 'onerror' !== key);
  }, this);

  this._globals = this._globals.concat(leaks);

  if (leaks.length > 1) {
    this.fail(test, new Error('global leaks detected: ' + leaks.join(', ') + ''));
  } else if (leaks.length) {
    this.fail(test, new Error('global leak detected: ' + leaks[0]));
  }
};

/**
 * Fail the given `test`.
 *
 * @param {Test} test
 * @param {Error} err
 * @api private
 */

Runner.prototype.fail = function(test, err){
  ++this.failures;
  test.state = 'failed';
  if ('string' == typeof err) {
    err = new Error('the string "' + err + '" was thrown, throw an Error :)');
  }
  this.emit('fail', test, err);
};

/**
 * Fail the given `hook` with `err`.
 *
 * Hook failures (currently) hard-end due
 * to that fact that a failing hook will
 * surely cause subsequent tests to fail,
 * causing jumbled reporting.
 *
 * @param {Hook} hook
 * @param {Error} err
 * @api private
 */

Runner.prototype.failHook = function(hook, err){
  this.fail(hook, err);
  this.emit('end');
};

/**
 * Run hook `name` callbacks and then invoke `fn()`.
 *
 * @param {String} name
 * @param {Function} function
 * @api private
 */

Runner.prototype.hook = function(name, fn){
  var suite = this.suite
    , hooks = suite['_' + name]
    , ms = suite._timeout
    , self = this
    , timer;

  function next(i) {
    var hook = hooks[i];
    if (!hook) return fn();
    self.currentRunnable = hook;

    self.emit('hook', hook);

    hook.on('error', function(err){
      self.failHook(hook, err);
    });

    hook.run(function(err){
      hook.removeAllListeners('error');
      if (err) return self.failHook(hook, err);
      self.emit('hook end', hook);
      next(++i);
    });
  }

  process.nextTick(function(){
    next(0);
  });
};

/**
 * Run hook `name` for the given array of `suites`
 * in order, and callback `fn(err)`.
 *
 * @param {String} name
 * @param {Array} suites
 * @param {Function} fn
 * @api private
 */

Runner.prototype.hooks = function(name, suites, fn){
  var self = this
    , orig = this.suite;

  function next(suite) {
    self.suite = suite;

    if (!suite) {
      self.suite = orig;
      return fn();
    }

    self.hook(name, function(err){
      if (err) {
        self.suite = orig;
        return fn(err);
      }

      next(suites.pop());
    });
  }

  next(suites.pop());
};

/**
 * Run hooks from the top level down.
 *
 * @param {String} name
 * @param {Function} fn
 * @api private
 */

Runner.prototype.hookUp = function(name, fn){
  var suites = [this.suite].concat(this.parents()).reverse();
  this.hooks(name, suites, fn);
};

/**
 * Run hooks from the bottom up.
 *
 * @param {String} name
 * @param {Function} fn
 * @api private
 */

Runner.prototype.hookDown = function(name, fn){
  var suites = [this.suite].concat(this.parents());
  this.hooks(name, suites, fn);
};

/**
 * Return an array of parent Suites from
 * closest to furthest.
 *
 * @return {Array}
 * @api private
 */

Runner.prototype.parents = function(){
  var suite = this.suite
    , suites = [];
  while (suite = suite.parent) suites.push(suite);
  return suites;
};

/**
 * Run the current test and callback `fn(err)`.
 *
 * @param {Function} fn
 * @api private
 */

Runner.prototype.runTest = function(fn){
  var test = this.test
    , self = this;

  try {
    test.on('error', function(err){
      self.fail(test, err);
    });
    test.run(fn);
  } catch (err) {
    fn(err);
  }
};

/**
 * Run tests in the given `suite` and invoke
 * the callback `fn()` when complete.
 *
 * @param {Suite} suite
 * @param {Function} fn
 * @api private
 */

Runner.prototype.runTests = function(suite, fn){
  var self = this
    , tests = suite.tests
    , test;

  function next(err) {
    // if we bail after first err
    if (self.failures && suite._bail) return fn();

    // next test
    test = tests.shift();

    // all done
    if (!test) return fn();

    // grep
    if (!self._grep.test(test.fullTitle())) return next();

    // pending
    if (test.pending) {
      self.emit('pending', test);
      self.emit('test end', test);
      return next();
    }

    // execute test and hook(s)
    self.emit('test', self.test = test);
    self.hookDown('beforeEach', function(){
      self.currentRunnable = self.test;
      self.runTest(function(err){
        test = self.test;

        if (err) {
          self.fail(test, err);
          self.emit('test end', test);
          return self.hookUp('afterEach', next);
        }

        test.state = 'passed';
        self.emit('pass', test);
        self.emit('test end', test);
        self.hookUp('afterEach', next);
      });
    });
  }

  this.next = next;
  next();
};

/**
 * Run the given `suite` and invoke the
 * callback `fn()` when complete.
 *
 * @param {Suite} suite
 * @param {Function} fn
 * @api private
 */

Runner.prototype.runSuite = function(suite, fn){
  var total = this.grepTotal(suite)
    , self = this
    , i = 0;

  debug('run suite %s', suite.fullTitle());

  if (!total) return fn();

  this.emit('suite', this.suite = suite);

  function next() {
    var curr = suite.suites[i++];
    if (!curr) return done();
    self.runSuite(curr, next);
  }

  function done() {
    self.suite = suite;
    self.hook('afterAll', function(){
      self.emit('suite end', suite);
      fn();
    });
  }

  this.hook('beforeAll', function(){
    self.runTests(suite, next);
  });
};

/**
 * Handle uncaught exceptions.
 *
 * @param {Error} err
 * @api private
 */

Runner.prototype.uncaught = function(err){
  debug('uncaught exception');
  var runnable = this.currentRunnable;
  if ('failed' == runnable.state) return;
  runnable.clearTimeout();
  err.uncaught = true;
  this.fail(runnable, err);

  // recover from test
  if ('test' == runnable.type) {
    this.emit('test end', runnable);
    this.hookUp('afterEach', this.next);
    return;
  }

  // bail on hooks
  this.emit('end');
};

/**
 * Run the root suite and invoke `fn(failures)`
 * on completion.
 *
 * @param {Function} fn
 * @return {Runner} for chaining
 * @api public
 */

Runner.prototype.run = function(fn){
  var self = this
    , fn = fn || function(){};

  debug('start');

  // callback
  this.on('end', function(){
    debug('end');
    process.removeListener('uncaughtException', this.uncaught);
    fn(self.failures);
  });

  // run suites
  this.emit('start');
  this.runSuite(this.suite, function(){
    debug('finished running');
    self.emit('end');
  });

  // uncaught exception
  process.on('uncaughtException', function(err){
    self.uncaught(err);
  });

  return this;
};

}); // module: runner.js

require.register("suite.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var EventEmitter = require('browser/events').EventEmitter
  , debug = require('browser/debug')('suite')
  , utils = require('./utils')
  , Hook = require('./hook');

/**
 * Expose `Suite`.
 */

exports = module.exports = Suite;

/**
 * Create a new `Suite` with the given `title`
 * and parent `Suite`. When a suite with the
 * same title is already present, that suite
 * is returned to provide nicer reporter
 * and more flexible meta-testing.
 *
 * @param {Suite} parent
 * @param {String} title
 * @return {Suite}
 * @api public
 */

exports.create = function(parent, title){
  var suite = new Suite(title, parent.ctx);
  suite.parent = parent;
  title = suite.fullTitle();
  parent.addSuite(suite);
  return suite;
};

/**
 * Initialize a new `Suite` with the given
 * `title` and `ctx`.
 *
 * @param {String} title
 * @param {Context} ctx
 * @api private
 */

function Suite(title, ctx) {
  this.title = title;
  this.ctx = ctx;
  this.suites = [];
  this.tests = [];
  this._beforeEach = [];
  this._beforeAll = [];
  this._afterEach = [];
  this._afterAll = [];
  this.root = !title;
  this._timeout = 2000;
  this._bail = false;
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Suite.prototype = new EventEmitter;
Suite.prototype.constructor = Suite;


/**
 * Return a clone of this `Suite`.
 *
 * @return {Suite}
 * @api private
 */

Suite.prototype.clone = function(){
  var suite = new Suite(this.title);
  debug('clone');
  suite.ctx = this.ctx;
  suite.timeout(this.timeout());
  suite.bail(this.bail());
  return suite;
};

/**
 * Set timeout `ms` or short-hand such as "2s".
 *
 * @param {Number|String} ms
 * @return {Suite|Number} for chaining
 * @api private
 */

Suite.prototype.timeout = function(ms){
  if (0 == arguments.length) return this._timeout;
  if (String(ms).match(/s$/)) ms = parseFloat(ms) * 1000;
  debug('timeout %d', ms);
  this._timeout = parseInt(ms, 10);
  return this;
};

/**
 * Sets whether to bail after first error.
 *
 * @parma {Boolean} bail
 * @return {Suite|Number} for chaining
 * @api private
 */

Suite.prototype.bail = function(bail){
  if (0 == arguments.length) return this._bail;
  debug('bail %s', bail);
  this._bail = bail;
  return this;
};

/**
 * Run `fn(test[, done])` before running tests.
 *
 * @param {Function} fn
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.beforeAll = function(fn){
  var hook = new Hook('"before all" hook', fn);
  hook.parent = this;
  hook.timeout(this.timeout());
  hook.ctx = this.ctx;
  this._beforeAll.push(hook);
  this.emit('beforeAll', hook);
  return this;
};

/**
 * Run `fn(test[, done])` after running tests.
 *
 * @param {Function} fn
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.afterAll = function(fn){
  var hook = new Hook('"after all" hook', fn);
  hook.parent = this;
  hook.timeout(this.timeout());
  hook.ctx = this.ctx;
  this._afterAll.push(hook);
  this.emit('afterAll', hook);
  return this;
};

/**
 * Run `fn(test[, done])` before each test case.
 *
 * @param {Function} fn
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.beforeEach = function(fn){
  var hook = new Hook('"before each" hook', fn);
  hook.parent = this;
  hook.timeout(this.timeout());
  hook.ctx = this.ctx;
  this._beforeEach.push(hook);
  this.emit('beforeEach', hook);
  return this;
};

/**
 * Run `fn(test[, done])` after each test case.
 *
 * @param {Function} fn
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.afterEach = function(fn){
  var hook = new Hook('"after each" hook', fn);
  hook.parent = this;
  hook.timeout(this.timeout());
  hook.ctx = this.ctx;
  this._afterEach.push(hook);
  this.emit('afterEach', hook);
  return this;
};

/**
 * Add a test `suite`.
 *
 * @param {Suite} suite
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.addSuite = function(suite){
  suite.parent = this;
  suite.timeout(this.timeout());
  suite.bail(this.bail());
  this.suites.push(suite);
  this.emit('suite', suite);
  return this;
};

/**
 * Add a `test` to this suite.
 *
 * @param {Test} test
 * @return {Suite} for chaining
 * @api private
 */

Suite.prototype.addTest = function(test){
  test.parent = this;
  test.timeout(this.timeout());
  test.ctx = this.ctx;
  this.tests.push(test);
  this.emit('test', test);
  return this;
};

/**
 * Return the full title generated by recursively
 * concatenating the parent's full title.
 *
 * @return {String}
 * @api public
 */

Suite.prototype.fullTitle = function(){
  if (this.parent) {
    var full = this.parent.fullTitle();
    if (full) return full + ' ' + this.title;
  }
  return this.title;
};

/**
 * Return the total number of tests.
 *
 * @return {Number}
 * @api public
 */

Suite.prototype.total = function(){
  return utils.reduce(this.suites, function(sum, suite){
    return sum + suite.total();
  }, 0) + this.tests.length;
};

/**
 * Iterates through each suite recursively to find
 * all tests. Applies a function in the format
 * `fn(test)`.
 *
 * @param {Function} fn
 * @return {Suite}
 * @api private
 */

Suite.prototype.eachTest = function(fn){
  utils.forEach(this.tests, fn);
  utils.forEach(this.suites, function(suite){
    suite.eachTest(fn);
  });
  return this;
};

}); // module: suite.js

require.register("test.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var Runnable = require('./runnable');

/**
 * Expose `Test`.
 */

module.exports = Test;

/**
 * Initialize a new `Test` with the given `title` and callback `fn`.
 *
 * @param {String} title
 * @param {Function} fn
 * @api private
 */

function Test(title, fn) {
  Runnable.call(this, title, fn);
  this.pending = !fn;
  this.type = 'test';
}

/**
 * Inherit from `Runnable.prototype`.
 */

Test.prototype = new Runnable;
Test.prototype.constructor = Test;


/**
 * Inspect the context void of private properties.
 *
 * @return {String}
 * @api private
 */

Test.prototype.inspect = function(){
  return JSON.stringify(this, function(key, val){
    return '_' == key[0]
      ? undefined
      : 'parent' == key
        ? '#<Suite>'
        : val;
  }, 2);
};
}); // module: test.js

require.register("utils.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var fs = require('browser/fs')
  , path = require('browser/path')
  , join = path.join
  , debug = require('browser/debug')('watch');

/**
 * Ignored directories.
 */

var ignore = ['node_modules', '.git'];

/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 * @api private
 */

exports.escape = function(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Array#forEach (<=IE8)
 *
 * @param {Array} array
 * @param {Function} fn
 * @param {Object} scope
 * @api private
 */

exports.forEach = function(arr, fn, scope) {
  for (var i = 0, l = arr.length; i < l; i++)
    fn.call(scope, arr[i], i);
};

/**
 * Array#indexOf (<=IE8)
 *
 * @parma {Array} arr
 * @param {Object} obj to find index of
 * @param {Number} start
 * @api private
 */

exports.indexOf = function (arr, obj, start) {
  for (var i = start || 0, l = arr.length; i < l; i++) {
    if (arr[i] === obj)
      return i;
  }
  return -1;
};

/**
 * Array#reduce (<=IE8)
 * 
 * @param {Array} array
 * @param {Function} fn
 * @param {Object} initial value
 * @param {Object} scope
 * @api private
 */

exports.reduce = function(arr, fn, val, scope) {
  var rval = val;

  for (var i = 0, l = arr.length; i < l; i++) {
    rval = fn.call(scope, rval, arr[i], i, arr);
  }

  return rval;
};

/**
 * Array#filter (<=IE8)
 *
 * @param {Array} array
 * @param {Function} fn
 * @param {Object} scope
 * @api private
 */

exports.filter = function(arr, fn, scope) {
  var ret = [];

  for (var i = 0, l = arr.length; i < l; i++) {
    var val = arr[i];
    if (fn.call(scope, val, i, arr))
      ret.push(val);
  }

  return ret;
};

/**
 * Object.keys (<=IE8)
 *
 * @param {Object} obj
 * @return {Array} keys
 * @api private
 */

exports.keys = Object.keys || function(obj) {
  var keys = []
    , has = Object.prototype.hasOwnProperty // for `window` on <=IE8

  for (var key in obj) {
    if (has.call(obj, key)) {
      keys.push(key);
    }
  }

  return keys;
};

/**
 * Watch the given `files` for changes
 * and invoke `fn(file)` on modification.
 *
 * @param {Array} files
 * @param {Function} fn
 * @api private
 */

exports.watch = function(files, fn){
  var options = { interval: 100 };
  files.forEach(function(file){
    debug('file %s', file);
    fs.watchFile(file, options, function(curr, prev){
      if (prev.mtime < curr.mtime) fn(file);
    });
  });
};

/**
 * Ignored files.
 */

function ignored(path){
  return !~ignore.indexOf(path);
}

/**
 * Lookup files in the given `dir`.
 *
 * @return {Array}
 * @api private
 */

exports.files = function(dir, ret){
  ret = ret || [];

  fs.readdirSync(dir)
  .filter(ignored)
  .forEach(function(path){
    path = join(dir, path);
    if (fs.statSync(path).isDirectory()) {
      exports.files(path, ret);
    } else if (path.match(/\.(js|coffee)$/)) {
      ret.push(path);
    }
  });

  return ret;
};

/**
 * Compute a slug from the given `str`.
 *
 * @param {String} str
 * @return {String}
 */

exports.slug = function(str){
  return str
    .toLowerCase()
    .replace(/ +/g, '-')
    .replace(/[^-\w]/g, '');
};
}); // module: utils.js
/**
 * Node shims.
 *
 * These are meant only to allow
 * mocha.js to run untouched, not
 * to allow running node code in
 * the browser.
 */

process = {};
process.exit = function(status){};
process.stdout = {};
global = window;

/**
 * next tick implementation.
 */

process.nextTick = (function(){
  // postMessage behaves badly on IE8
  if (window.ActiveXObject || !window.postMessage) {
    return function(fn){ fn() };
  }

  // based on setZeroTimeout by David Baron
  // - http://dbaron.org/log/20100309-faster-timeouts
  var timeouts = []
    , name = 'mocha-zero-timeout'

  window.addEventListener('message', function(e){
    if (e.source == window && e.data == name) {
      if (e.stopPropagation) e.stopPropagation();
      if (timeouts.length) timeouts.shift()();
    }
  }, true);

  return function(fn){
    timeouts.push(fn);
    window.postMessage(name, '*');
  }
})();

/**
 * Remove uncaughtException listener.
 */

process.removeListener = function(e){
  if ('uncaughtException' == e) {
    window.onerror = null;
  }
};

/**
 * Implements uncaughtException listener.
 */

process.on = function(e, fn){
  if ('uncaughtException' == e) {
    window.onerror = fn;
  }
};

/**
 * Expose mocha.
 */

window.mocha = require('mocha');

// boot
;(function(){
  var suite = new mocha.Suite('', new mocha.Context)
    , utils = mocha.utils
    , options = {}

  /**
   * Highlight the given string of `js`.
   */

  function highlight(js) {
    return js
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\/\/(.*)/gm, '<span class="comment">//$1</span>')
      .replace(/('.*?')/gm, '<span class="string">$1</span>')
      .replace(/(\d+\.\d+)/gm, '<span class="number">$1</span>')
      .replace(/(\d+)/gm, '<span class="number">$1</span>')
      .replace(/\bnew *(\w+)/gm, '<span class="keyword">new</span> <span class="init">$1</span>')
      .replace(/\b(function|new|throw|return|var|if|else)\b/gm, '<span class="keyword">$1</span>')
  }

  /**
   * Highlight code contents.
   */

  function highlightCode() {
    var code = document.getElementsByTagName('code');
    for (var i = 0, len = code.length; i < len; ++i) {
      code[i].innerHTML = highlight(code[i].innerHTML);
    }
  }

  /**
   * Parse the given `qs`.
   */

  function parse(qs) {
    return utils.reduce(qs.replace('?', '').split('&'), function(obj, pair){
        var i = pair.indexOf('=')
          , key = pair.slice(0, i)
          , val = pair.slice(++i);

        obj[key] = decodeURIComponent(val);
        return obj;
      }, {});
  }

  /**
   * Setup mocha with the given setting options.
   */

  mocha.setup = function(opts){
    if ('string' === typeof opts) options.ui = opts;
    else options = opts;

    ui = mocha.interfaces[options.ui];
    if (!ui) throw new Error('invalid mocha interface "' + ui + '"');
    if (options.timeout) suite.timeout(options.timeout);
    ui(suite);
    suite.emit('pre-require', window);
  };

  /**
   * Run mocha, returning the Runner.
   */

  mocha.run = function(fn){
    suite.emit('run');
    var runner = new mocha.Runner(suite);
    var Reporter = options.reporter || mocha.reporters.HTML;
    var reporter = new Reporter(runner);
    var query = parse(window.location.search || "");
    if (query.grep) runner.grep(new RegExp(query.grep));
    if (options.ignoreLeaks) runner.ignoreLeaks = true;
    if (options.globals) runner.globals(options.globals);
    runner.globals(['location']);
    runner.on('end', highlightCode);
    return runner.run(fn);
  };
})();
})();

!function (name, definition) {
  if (typeof define == 'function' && typeof define.amd  == 'object') define(definition);
  else this[name] = definition();
}('chai', function () {

// CommonJS require()

function require(p){
    var path = require.resolve(p)
      , mod = require.modules[path];
    if (!mod) throw new Error('failed to require "' + p + '"');
    if (!mod.exports) {
      mod.exports = {};
      mod.call(mod.exports, mod, mod.exports, require.relative(path));
    }
    return mod.exports;
  }

require.modules = {};

require.resolve = function (path){
    var orig = path
      , reg = path + '.js'
      , index = path + '/index.js';
    return require.modules[reg] && reg
      || require.modules[index] && index
      || orig;
  };

require.register = function (path, fn){
    require.modules[path] = fn;
  };

require.relative = function (parent) {
    return function(p){
      if ('.' != p[0]) return require(p);

      var path = parent.split('/')
        , segs = p.split('/');
      path.pop();

      for (var i = 0; i < segs.length; i++) {
        var seg = segs[i];
        if ('..' == seg) path.pop();
        else if ('.' != seg) path.push(seg);
      }

      return require(path.join('/'));
    };
  };


require.register("assertion.js", function(module, exports, require){
/*!
 * chai
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 *
 * Primarily a refactor of: should.js
 * https://github.com/visionmedia/should.js
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * ### BDD Style Introduction
 *
 * The BDD style is exposed through `expect` or `should` interfaces. In both
 * scenarios, you chain together natural language assertions.
 *
 *      // expect
 *      var expect = require('chai').expect;
 *      expect(foo).to.equal('bar');
 *
 *      // should
 *      var should = require('chai').should();
 *      foo.should.equal('bar');
 *
 * #### Differences
 *
 * The `expect` interface provides a function as a starting point for chaining
 * your language assertions. It works on node.js and in all browsers.
 *
 * The `should` interface extends `Object.prototype` to provide a single getter as
 * the starting point for your language assertions. It works on node.js and in
 * all browsers except Internet Explorer.
 *
 * #### Configuration
 *
 * By default, Chai does not show stack traces upon an AssertionError. This can
 * be changed by modifying the `includeStack` parameter for chai.Assertion. For example:
 *
 *      var chai = require('chai');
 *      chai.Assertion.includeStack = true; // defaults to false
 */

/*!
 * Module dependencies.
 */

var AssertionError = require('./error')
  , eql = require('./utils/eql')
  , toString = Object.prototype.toString
  , inspect = require('./utils/inspect');

/*!
 * Module export.
 */

module.exports = Assertion;


/*!
 * # Assertion Constructor
 *
 * Creates object for chaining.
 *
 * @api private
 */

function Assertion (obj, msg, stack) {
  this.ssfi = stack || arguments.callee;
  this.obj = obj;
  this.msg = msg;
}

/*!
  * ## Assertion.includeStack
  * , toString = Object.prototype.toString
  *
  * User configurable property, influences whether stack trace
  * is included in Assertion error message. Default of false
  * suppresses stack trace in the error message
  *
  *     Assertion.includeStack = true;  // enable stack on error
  *
  * @api public
  */

Assertion.includeStack = false;

/*!
 * # .assert(expression, message, negateMessage, expected, actual)
 *
 * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.
 *
 * @name assert
 * @param {Philosophical} expression to be tested
 * @param {String} message to display if fails
 * @param {String} negatedMessage to display if negated expression fails
 * @param {*} expected value (remember to check for negation)
 * @param {*} actual (optional) will default to `this.obj`
 * @api private
 */

Assertion.prototype.assert = function (expr, msg, negateMsg, expected, actual) {
  actual = actual || this.obj;
  var msg = (this.negate ? negateMsg : msg)
    , ok = this.negate ? !expr : expr;

  if (!ok) {
    throw new AssertionError({
        message: this.msg ? this.msg + ': ' + msg : msg // include custom message if available
      , actual: actual
      , expected: expected
      , stackStartFunction: (Assertion.includeStack) ? this.assert : this.ssfi
    });
  }
};

/*!
 * # inspect
 *
 * Returns the current object stringified.
 *
 * @name inspect
 * @api private
 */

Object.defineProperty(Assertion.prototype, 'inspect',
  { get: function () {
      return inspect(this.obj);
    }
  , configurable: true
});

/**
 * # to
 *
 * Language chain.
 *
 * @name to
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'to',
  { get: function () {
      return this;
    }
  , configurable: true
});

/**
 * # be
 *
 * Language chain.
 *
 * @name be
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'be',
  { get: function () {
      return this;
    }
  , configurable: true
});

/**
 * # been
 *
 * Language chain. Also tests `tense` to past for addon
 * modules that use the tense feature.
 *
 * @name been
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'been',
  { get: function () {
      this.tense = 'past';
      return this;
    }
  , configurable: true
});

/**
 * # an
 *
 * Language chain.
 *
 * @name an
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'an',
  { get: function () {
      return this;
    }
  , configurable: true
});
/**
 * # is
 *
 * Language chain.
 *
 * @name is
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'is',
  { get: function () {
      return this;
    }
  , configurable: true
});

/**
 * # and
 *
 * Language chain.
 *
 * @name and
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'and',
  { get: function () {
      return this;
    }
  , configurable: true
});

/**
 * # have
 *
 * Language chain.
 *
 * @name have
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'have',
  { get: function () {
      return this;
    }
  , configurable: true
});

/**
 * # with
 *
 * Language chain.
 *
 * @name with
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'with',
  { get: function () {
      return this;
    }
  , configurable: true
});

/**
 * # .not
 *
 * Negates any of assertions following in the chain.
 *
 * @name not
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'not',
  { get: function () {
      this.negate = true;
      return this;
    }
  , configurable: true
});

/**
 * # .ok
 *
 * Assert object truthiness.
 *
 *      expect('everthing').to.be.ok;
 *      expect(false).to.not.be.ok;
 *      expect(undefined).to.not.be.ok;
 *      expect(null).to.not.be.ok;
 *
 * @name ok
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'ok',
  { get: function () {
      this.assert(
          this.obj
        , 'expected ' + this.inspect + ' to be truthy'
        , 'expected ' + this.inspect + ' to be falsy');

      return this;
    }
  , configurable: true
});

/**
 * # .true
 *
 * Assert object is true
 *
 * @name true
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'true',
  { get: function () {
      this.assert(
          true === this.obj
        , 'expected ' + this.inspect + ' to be true'
        , 'expected ' + this.inspect + ' to be false'
        , this.negate ? false : true
      );

      return this;
    }
  , configurable: true
});

/**
 * # .false
 *
 * Assert object is false
 *
 * @name false
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'false',
  { get: function () {
      this.assert(
          false === this.obj
        , 'expected ' + this.inspect + ' to be false'
        , 'expected ' + this.inspect + ' to be true'
        , this.negate ? true : false
      );

      return this;
    }
  , configurable: true
});

/**
 * # .exist
 *
 * Assert object exists (null).
 *
 *      var foo = 'hi'
 *        , bar;
 *      expect(foo).to.exist;
 *      expect(bar).to.not.exist;
 *
 * @name exist
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'exist',
  { get: function () {
      this.assert(
          null != this.obj
        , 'expected ' + this.inspect + ' to exist'
        , 'expected ' + this.inspect + ' to not exist'
      );

      return this;
    }
  , configurable: true
});

/**
 * # .empty
 *
 * Assert object's length to be 0.
 *
 *      expect([]).to.be.empty;
 *
 * @name empty
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'empty',
  { get: function () {
      var expected = this.obj;

      if (Array.isArray(this.obj)) {
        expected = this.obj.length;
      } else if (typeof this.obj === 'object') {
        expected = Object.keys(this.obj).length;
      }

      this.assert(
          !expected
        , 'expected ' + this.inspect + ' to be empty'
        , 'expected ' + this.inspect + ' not to be empty');

      return this;
    }
  , configurable: true
});

/**
 * # .arguments
 *
 * Assert object is an instanceof arguments.
 *
 *      function test () {
 *        expect(arguments).to.be.arguments;
 *      }
 *
 * @name arguments
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'arguments',
  { get: function () {
      this.assert(
          '[object Arguments]' == Object.prototype.toString.call(this.obj)
        , 'expected ' + this.inspect + ' to be arguments'
        , 'expected ' + this.inspect + ' to not be arguments'
        , '[object Arguments]'
        , Object.prototype.toString.call(this.obj)
      );

      return this;
    }
  , configurable: true
});

/**
 * # .equal(value)
 *
 * Assert strict equality.
 *
 *      expect('hello').to.equal('hello');
 *
 * @name equal
 * @param {*} value
 * @api public
 */

Assertion.prototype.equal = function (val) {
  this.assert(
      val === this.obj
    , 'expected ' + this.inspect + ' to equal ' + inspect(val)
    , 'expected ' + this.inspect + ' to not equal ' + inspect(val)
    , val );

  return this;
};

/**
 * # .eql(value)
 *
 * Assert deep equality.
 *
 *      expect({ foo: 'bar' }).to.eql({ foo: 'bar' });
 *
 * @name eql
 * @param {*} value
 * @api public
 */

Assertion.prototype.eql = function (obj) {
  this.assert(
      eql(obj, this.obj)
    , 'expected ' + this.inspect + ' to equal ' + inspect(obj)
    , 'expected ' + this.inspect + ' to not equal ' + inspect(obj)
    , obj );

  return this;
};

/**
 * # .above(value)
 *
 * Assert greater than `value`.
 *
 *      expect(10).to.be.above(5);
 *
 * @name above
 * @param {Number} value
 * @api public
 */

Assertion.prototype.above = function (val) {
  this.assert(
      this.obj > val
    , 'expected ' + this.inspect + ' to be above ' + val
    , 'expected ' + this.inspect + ' to be below ' + val);

  return this;
};

/**
 * # .below(value)
 *
 * Assert less than `value`.
 *
 *      expect(5).to.be.below(10);
 *
 * @name below
 * @param {Number} value
 * @api public
 */

Assertion.prototype.below = function (val) {
  this.assert(
      this.obj < val
    , 'expected ' + this.inspect + ' to be below ' + val
    , 'expected ' + this.inspect + ' to be above ' + val);

  return this;
};

/**
 * # .within(start, finish)
 *
 * Assert that a number is within a range.
 *
 *      expect(7).to.be.within(5,10);
 *
 * @name within
 * @param {Number} start lowerbound inclusive
 * @param {Number} finish upperbound inclusive
 * @api public
 */

Assertion.prototype.within = function (start, finish) {
  var range = start + '..' + finish;

  this.assert(
      this.obj >= start && this.obj <= finish
    , 'expected ' + this.inspect + ' to be within ' + range
    , 'expected ' + this.inspect + ' to not be within ' + range);

  return this;
};

/**
 * # .a(type)
 *
 * Assert typeof.
 *
 *      expect('test').to.be.a('string');
 *
 * @name a
 * @param {String} type
 * @api public
 */

Assertion.prototype.a = function (type) {
  var klass = type.charAt(0).toUpperCase() + type.slice(1);

  this.assert(
      '[object ' + klass + ']' === toString.call(this.obj)
    , 'expected ' + this.inspect + ' to be a ' + type
    , 'expected ' + this.inspect + ' not to be a ' + type
    , '[object ' + klass + ']'
    , toString.call(this.obj)
  );

  return this;
};

/**
 * # .instanceof(constructor)
 *
 * Assert instanceof.
 *
 *      var Tea = function (name) { this.name = name; }
 *        , Chai = new Tea('chai');
 *
 *      expect(Chai).to.be.an.instanceOf(Tea);
 *
 * @name instanceof
 * @param {Constructor}
 * @alias instanceOf
 * @api public
 */

Assertion.prototype.instanceof = function (constructor) {
  var name = constructor.name;
  this.assert(
      this.obj instanceof constructor
    , 'expected ' + this.inspect + ' to be an instance of ' + name
    , 'expected ' + this.inspect + ' to not be an instance of ' + name);

  return this;
};

/**
 * # .property(name, [value])
 *
 * Assert that property of `name` exists, optionally with `value`.
 *
 *      var obj = { foo: 'bar' }
 *      expect(obj).to.have.property('foo');
 *      expect(obj).to.have.property('foo', 'bar');
 *      expect(obj).to.have.property('foo').to.be.a('string');
 *
 * @name property
 * @param {String} name
 * @param {*} value (optional)
 * @returns value of property for chaining
 * @api public
 */

Assertion.prototype.property = function (name, val) {
  if (this.negate && undefined !== val) {
    if (undefined === this.obj[name]) {
      throw new Error(this.inspect + ' has no property ' + inspect(name));
    }
  } else {
    this.assert(
        undefined !== this.obj[name]
      , 'expected ' + this.inspect + ' to have a property ' + inspect(name)
      , 'expected ' + this.inspect + ' to not have property ' + inspect(name));
  }

  if (undefined !== val) {
    this.assert(
        val === this.obj[name]
      , 'expected ' + this.inspect + ' to have a property ' + inspect(name) + ' of ' +
          inspect(val) + ', but got ' + inspect(this.obj[name])
      , 'expected ' + this.inspect + ' to not have a property ' + inspect(name) + ' of ' +  inspect(val)
      , val
      , this.obj[val]
    );
  }

  this.obj = this.obj[name];
  return this;
};

/**
 * # .ownProperty(name)
 *
 * Assert that has own property by `name`.
 *
 *      expect('test').to.have.ownProperty('length');
 *
 * @name ownProperty
 * @alias haveOwnProperty
 * @param {String} name
 * @api public
 */

Assertion.prototype.ownProperty = function (name) {
  this.assert(
      this.obj.hasOwnProperty(name)
    , 'expected ' + this.inspect + ' to have own property ' + inspect(name)
    , 'expected ' + this.inspect + ' to not have own property ' + inspect(name));
  return this;
};

/**
 * # .length(val)
 *
 * Assert that object has expected length.
 *
 *      expect([1,2,3]).to.have.length(3);
 *      expect('foobar').to.have.length(6);
 *
 * @name length
 * @alias lengthOf
 * @param {Number} length
 * @api public
 */

Assertion.prototype.length = function (n) {
  new Assertion(this.obj).to.have.property('length');
  var len = this.obj.length;

  this.assert(
      len == n
    , 'expected ' + this.inspect + ' to have a length of ' + n + ' but got ' + len
    , 'expected ' + this.inspect + ' to not have a length of ' + len
    , n
    , len
  );

  return this;
};

/**
 * # .match(regexp)
 *
 * Assert that matches regular expression.
 *
 *      expect('foobar').to.match(/^foo/);
 *
 * @name match
 * @param {RegExp} RegularExpression
 * @api public
 */

Assertion.prototype.match = function (re) {
  this.assert(
      re.exec(this.obj)
    , 'expected ' + this.inspect + ' to match ' + re
    , 'expected ' + this.inspect + ' not to match ' + re);

  return this;
};

/**
 * # .include(obj)
 *
 * Assert the inclusion of an object in an Array or substring in string.
 *
 *      expect([1,2,3]).to.include(2);
 *
 * @name include
 * @param {Object|String|Number} obj
 * @api public
 */

Assertion.prototype.include = function (obj) {
  this.assert(
      ~this.obj.indexOf(obj)
    , 'expected ' + this.inspect + ' to include ' + inspect(obj)
    , 'expected ' + this.inspect + ' to not include ' + inspect(obj));

  return this;
};

/**
 * # .string(string)
 *
 * Assert inclusion of string in string.
 *
 *      expect('foobar').to.have.string('bar');
 *
 * @name string
 * @param {String} string
 * @api public
 */

Assertion.prototype.string = function (str) {
  new Assertion(this.obj).is.a('string');

  this.assert(
      ~this.obj.indexOf(str)
    , 'expected ' + this.inspect + ' to contain ' + inspect(str)
    , 'expected ' + this.inspect + ' to not contain ' + inspect(str));

  return this;
};



/**
 * # contain
 *
 * Toggles the `contain` flag for the `keys` assertion.
 *
 * @name contain
 * @api public
 */

Object.defineProperty(Assertion.prototype, 'contain',
  { get: function () {
      this.contains = true;
      return this;
    },
    configurable: true
});

/**
 * # .keys(key1, [key2], [...])
 *
 * Assert exact keys or the inclusing of keys using the `contain` modifier.
 *
 *      expect({ foo: 1, bar: 2 }).to.have.keys(['foo', 'bar']);
 *      expect({ foo: 1, bar: 2, baz: 3 }).to.contain.keys('foo', 'bar');
 *
 * @name keys
 * @alias key
 * @param {String|Array} Keys
 * @api public
 */

Assertion.prototype.keys = function(keys) {
  var str
    , ok = true;

  keys = keys instanceof Array
    ? keys
    : Array.prototype.slice.call(arguments);

  if (!keys.length) throw new Error('keys required');

  var actual = Object.keys(this.obj)
    , len = keys.length;

  // Inclusion
  ok = keys.every(function(key){
    return ~actual.indexOf(key);
  });

  // Strict
  if (!this.negate && !this.contains) {
    ok = ok && keys.length == actual.length;
  }

  // Key string
  if (len > 1) {
    keys = keys.map(function(key){
      return inspect(key);
    });
    var last = keys.pop();
    str = keys.join(', ') + ', and ' + last;
  } else {
    str = inspect(keys[0]);
  }

  // Form
  str = (len > 1 ? 'keys ' : 'key ') + str;

  // Have / include
  str = (this.contains ? 'contain ' : 'have ') + str;

  // Assertion
  this.assert(
      ok
    , 'expected ' + this.inspect + ' to ' + str
    , 'expected ' + this.inspect + ' to not ' + str
    , keys
    , Object.keys(this.obj)
  );

  return this;
}

/**
 * # .throw(constructor)
 *
 * Assert that a function will throw a specific type of error or that error
 * thrown will match a RegExp or include a string.
 *
 *      var fn = function () { throw new ReferenceError('This is a bad function.'); }
 *      expect(fn).to.throw(ReferenceError);
 *      expect(fn).to.throw(/bad function/);
 *      expect(fn).to.not.throw('good function');
 *      expect(fn).to.throw(ReferenceError, /bad function/);
 *
 * Please note that when a throw expectation is negated, it will check each
 * parameter independently, starting with Error constructor type. The appropriate way
 * to check for the existence of a type of error but for a message that does not match
 * is to use `and`.
 *
 *      expect(fn).to.throw(ReferenceError).and.not.throw(/good function/);
 *
 * @name throw
 * @alias throws
 * @alias Throw
 * @param {ErrorConstructor} constructor
 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
 * @api public
 */

Assertion.prototype.throw = function (constructor, msg) {
  new Assertion(this.obj).is.a('function');

  var thrown = false;

  if (arguments.length === 0) {
    msg = null;
    constructor = null;
  } else if (constructor && (constructor instanceof RegExp || 'string' === typeof constructor)) {
    msg = constructor;
    constructor = null;
  }

  try {
    this.obj();
  } catch (err) {
    // first, check constructor
    if (constructor && 'function' === typeof constructor) {
      this.assert(
          err instanceof constructor && err.name == constructor.name
        , 'expected ' + this.inspect + ' to throw ' + constructor.name + ' but a ' + err.name + ' was thrown'
        , 'expected ' + this.inspect + ' to not throw ' + constructor.name );
      if (!msg) return this;
    }
    // next, check message
    if (err.message && msg && msg instanceof RegExp) {
      this.assert(
          msg.exec(err.message)
        , 'expected ' + this.inspect + ' to throw error matching ' + msg + ' but got ' + inspect(err.message)
        , 'expected ' + this.inspect + ' to throw error not matching ' + msg
      );
      return this;
    } else if (err.message && msg && 'string' === typeof msg) {
      this.assert(
          ~err.message.indexOf(msg)
        , 'expected ' + this.inspect + ' to throw error including ' + inspect(msg) + ' but got ' + inspect(err.message)
        , 'expected ' + this.inspect + ' to throw error not including ' + inspect(msg)
      );
      return this;
    } else {
      thrown = true;
    }
  }

  var name = (constructor ? constructor.name : 'an error');

  this.assert(
      thrown === true
    , 'expected ' + this.inspect + ' to throw ' + name
    , 'expected ' + this.inspect + ' to not throw ' + name);

  return this;
};

/**
 * # .respondTo(method)
 *
 * Assert that object/class will respond to a method.
 *
 *      expect(Klass).to.respondTo('bar');
 *      expect(obj).to.respondTo('bar');
 *
 * @name respondTo
 * @param {String} method
 * @api public
 */

Assertion.prototype.respondTo = function (method) {
  var context = ('function' === typeof this.obj)
    ? this.obj.prototype[method]
    : this.obj[method];

  this.assert(
      'function' === typeof context
    , 'expected ' + this.inspect + ' to respond to ' + inspect(method)
    , 'expected ' + this.inspect + ' to not respond to ' + inspect(method)
    , 'function'
    , typeof context
  );

  return this;
};

/**
 * # .satisfy(method)
 *
 * Assert that passes a truth test.
 *
 *      expect(1).to.satisfy(function(num) { return num > 0; });
 *
 * @name satisfy
 * @param {Function} matcher
 * @api public
 */

Assertion.prototype.satisfy = function (matcher) {
  this.assert(
      matcher(this.obj)
    , 'expected ' + this.inspect + ' to satisfy ' + inspect(matcher)
    , 'expected ' + this.inspect + ' to not satisfy' + inspect(matcher)
    , this.negate ? false : true
    , matcher(this.obj)
  );

  return this;
};

/**
 * # .closeTo(expected, delta)
 *
 * Assert that actual is equal to +/- delta.
 *
 *      expect(1.5).to.be.closeTo(1, 0.5);
 *
 * @name closeTo
 * @param {Number} expected
 * @param {Number} delta
 * @api public
 */

Assertion.prototype.closeTo = function (expected, delta) {
  this.assert(
      (this.obj - delta === expected) || (this.obj + delta === expected)
    , 'expected ' + this.inspect + ' to be close to ' + expected + ' +/- ' + delta
    , 'expected ' + this.inspect + ' not to be close to ' + expected + ' +/- ' + delta);

  return this;
};

/*!
 * Aliases.
 */

(function alias(name, as){
  Assertion.prototype[as] = Assertion.prototype[name];
  return alias;
})
('length', 'lengthOf')
('keys', 'key')
('ownProperty', 'haveOwnProperty')
('above', 'greaterThan')
('below', 'lessThan')
('throw', 'throws')
('throw', 'Throw') // for troublesome browsers
('instanceof', 'instanceOf');

}); // module: assertion.js

require.register("chai.js", function(module, exports, require){
/*!
 * chai
 * Copyright(c) 2011-2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var used = [];
var exports = module.exports = {};

exports.version = '0.5.2';

exports.Assertion = require('./assertion');
exports.AssertionError = require('./error');

exports.inspect = require('./utils/inspect');

exports.use = function (fn) {
  if (!~used.indexOf(fn)) {
    fn(this);
    used.push(fn);
  }

  return this;
};

var expect = require('./interface/expect');
exports.use(expect);

var should = require('./interface/should');
exports.use(should);

var assert = require('./interface/assert');
exports.use(assert);

}); // module: chai.js

require.register("error.js", function(module, exports, require){
/*!
 * chai
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var fail = require('./chai').fail;

module.exports = AssertionError;

/*!
 * Inspired by node.js assert module
 * https://github.com/joyent/node/blob/f8c335d0caf47f16d31413f89aa28eda3878e3aa/lib/assert.js
 */
function AssertionError (options) {
  options = options || {};
  this.name = 'AssertionError';
  this.message = options.message;
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
}

AssertionError.prototype.__proto__ = Error.prototype;

AssertionError.prototype.toString = function() {
  return this.message;
};

}); // module: error.js

require.register("interface/assert.js", function(module, exports, require){
/*!
 * chai
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### TDD Style Introduction
 *
 * The TDD style is exposed through `assert` interfaces. This provides
 * the classic assert.`test` notation, similiar to that packaged with
 * node.js. This assert module, however, provides several additional
 * tests and is browser compatible.
 *
 *      // assert
 *      var assert = require('chai').assert;
 *        , foo = 'bar';
 *
 *      assert.typeOf(foo, 'string');
 *      assert.equal(foo, 'bar');
 *
 * #### Configuration
 *
 * By default, Chai does not show stack traces upon an AssertionError. This can
 * be changed by modifying the `includeStack` parameter for chai.Assertion. For example:
 *
 *      var chai = require('chai');
 *      chai.Assertion.includeStack = true; // defaults to false
 */

module.exports = function (chai) {
  /*!
   * Chai dependencies.
   */
  var Assertion = chai.Assertion
    , inspect = chai.inspect;

  /*!
   * Module export.
   */

  var assert = chai.assert = {};

  /**
   * # .fail(actual, expect, msg, operator)
   *
   * Throw a failure. Node.js compatible.
   *
   * @name fail
   * @param {*} actual value
   * @param {*} expected value
   * @param {String} message
   * @param {String} operator
   * @api public
   */

  assert.fail = function (actual, expected, message, operator) {
    throw new chai.AssertionError({
        actual: actual
      , expected: expected
      , message: message
      , operator: operator
      , stackStartFunction: assert.fail
    });
  }

  /**
   * # .ok(object, [message])
   *
   * Assert object is truthy.
   *
   *      assert.ok('everthing', 'everything is ok');
   *      assert.ok(false, 'this will fail');
   *
   * @name ok
   * @param {*} object to test
   * @param {String} message
   * @api public
   */

  assert.ok = function (val, msg) {
    new Assertion(val, msg).is.ok;
  };

  /**
   * # .equal(actual, expected, [message])
   *
   * Assert strict equality.
   *
   *      assert.equal(3, 3, 'these numbers are equal');
   *
   * @name equal
   * @param {*} actual
   * @param {*} expected
   * @param {String} message
   * @api public
   */

  assert.equal = function (act, exp, msg) {
    var test = new Assertion(act, msg);

    test.assert(
        exp == test.obj
      , 'expected ' + test.inspect + ' to equal ' + inspect(exp)
      , 'expected ' + test.inspect + ' to not equal ' + inspect(exp));
  };

  /**
   * # .notEqual(actual, expected, [message])
   *
   * Assert not equal.
   *
   *      assert.notEqual(3, 4, 'these numbers are not equal');
   *
   * @name notEqual
   * @param {*} actual
   * @param {*} expected
   * @param {String} message
   * @api public
   */

  assert.notEqual = function (act, exp, msg) {
    var test = new Assertion(act, msg);

    test.assert(
        exp != test.obj
      , 'expected ' + test.inspect + ' to equal ' + inspect(exp)
      , 'expected ' + test.inspect + ' to not equal ' + inspect(exp));
  };

  /**
   * # .strictEqual(actual, expected, [message])
   *
   * Assert strict equality.
   *
   *      assert.strictEqual(true, true, 'these booleans are strictly equal');
   *
   * @name strictEqual
   * @param {*} actual
   * @param {*} expected
   * @param {String} message
   * @api public
   */

  assert.strictEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.equal(exp);
  };

  /**
   * # .notStrictEqual(actual, expected, [message])
   *
   * Assert strict equality.
   *
   *      assert.notStrictEqual(1, true, 'these booleans are not strictly equal');
   *
   * @name notStrictEqual
   * @param {*} actual
   * @param {*} expected
   * @param {String} message
   * @api public
   */

  assert.notStrictEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.not.equal(exp);
  };

  /**
   * # .deepEqual(actual, expected, [message])
   *
   * Assert not deep equality.
   *
   *      assert.deepEqual({ tea: 'green' }, { tea: 'green' });
   *
   * @name deepEqual
   * @param {*} actual
   * @param {*} expected
   * @param {String} message
   * @api public
   */

  assert.deepEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.eql(exp);
  };

  /**
   * # .notDeepEqual(actual, expected, [message])
   *
   * Assert not deep equality.
   *
   *      assert.notDeepEqual({ tea: 'green' }, { tea: 'jasmine' });
   *
   * @name notDeepEqual
   * @param {*} actual
   * @param {*} expected
   * @param {String} message
   * @api public
   */

  assert.notDeepEqual = function (act, exp, msg) {
    new Assertion(act, msg).to.not.eql(exp);
  };

  /**
   * # .isTrue(value, [message])
   *
   * Assert `value` is true.
   *
   *      var tea_served = true;
   *      assert.isTrue(tea_served, 'the tea has been served');
   *
   * @name isTrue
   * @param {Boolean} value
   * @param {String} message
   * @api public
   */

  assert.isTrue = function (val, msg) {
    new Assertion(val, msg).is.true;
  };

  /**
   * # .isFalse(value, [message])
   *
   * Assert `value` is false.
   *
   *      var tea_served = false;
   *      assert.isFalse(tea_served, 'no tea yet? hmm...');
   *
   * @name isFalse
   * @param {Boolean} value
   * @param {String} message
   * @api public
   */

  assert.isFalse = function (val, msg) {
    new Assertion(val, msg).is.false;
  };

  /**
   * # .isNull(value, [message])
   *
   * Assert `value` is null.
   *
   *      assert.isNull(err, 'no errors');
   *
   * @name isNull
   * @param {*} value
   * @param {String} message
   * @api public
   */

  assert.isNull = function (val, msg) {
    new Assertion(val, msg).to.equal(null);
  };

  /**
   * # .isNotNull(value, [message])
   *
   * Assert `value` is not null.
   *
   *      var tea = 'tasty chai';
   *      assert.isNotNull(tea, 'great, time for tea!');
   *
   * @name isNotNull
   * @param {*} value
   * @param {String} message
   * @api public
   */

  assert.isNotNull = function (val, msg) {
    new Assertion(val, msg).to.not.equal(null);
  };

  /**
   * # .isUndefined(value, [message])
   *
   * Assert `value` is undefined.
   *
   *      assert.isUndefined(tea, 'no tea defined');
   *
   * @name isUndefined
   * @param {*} value
   * @param {String} message
   * @api public
   */

  assert.isUndefined = function (val, msg) {
    new Assertion(val, msg).to.equal(undefined);
  };

  /**
   * # .isDefined(value, [message])
   *
   * Assert `value` is not undefined.
   *
   *      var tea = 'cup of chai';
   *      assert.isDefined(tea, 'no tea defined');
   *
   * @name isUndefined
   * @param {*} value
   * @param {String} message
   * @api public
   */

  assert.isDefined = function (val, msg) {
    new Assertion(val, msg).to.not.equal(undefined);
  };

  /**
   * # .isFunction(value, [message])
   *
   * Assert `value` is a function.
   *
   *      var serve_tea = function () { return 'cup of tea'; };
   *      assert.isFunction(serve_tea, 'great, we can have tea now');
   *
   * @name isFunction
   * @param {Function} value
   * @param {String} message
   * @api public
   */

  assert.isFunction = function (val, msg) {
    new Assertion(val, msg).to.be.a('function');
  };

  /**
   * # .isObject(value, [message])
   *
   * Assert `value` is an object.
   *
   *      var selection = { name: 'Chai', serve: 'with spices' };
   *      assert.isObject(selection, 'tea selection is an object');
   *
   * @name isObject
   * @param {Object} value
   * @param {String} message
   * @api public
   */

  assert.isObject = function (val, msg) {
    new Assertion(val, msg).to.be.a('object');
  };

  /**
   * # .isArray(value, [message])
   *
   * Assert `value` is an instance of Array.
   *
   *      var menu = [ 'green', 'chai', 'oolong' ];
   *      assert.isArray(menu, 'what kind of tea do we want?');
   *
   * @name isArray
   * @param {*} value
   * @param {String} message
   * @api public
   */

  assert.isArray = function (val, msg) {
    new Assertion(val, msg).to.be.instanceof(Array);
  };

  /**
   * # .isString(value, [message])
   *
   * Assert `value` is a string.
   *
   *      var teaorder = 'chai';
   *      assert.isString(tea_order, 'order placed');
   *
   * @name isString
   * @param {String} value
   * @param {String} message
   * @api public
   */

  assert.isString = function (val, msg) {
    new Assertion(val, msg).to.be.a('string');
  };

  /**
   * # .isNumber(value, [message])
   *
   * Assert `value` is a number
   *
   *      var cups = 2;
   *      assert.isNumber(cups, 'how many cups');
   *
   * @name isNumber
   * @param {Number} value
   * @param {String} message
   * @api public
   */

  assert.isNumber = function (val, msg) {
    new Assertion(val, msg).to.be.a('number');
  };

  /**
   * # .isBoolean(value, [message])
   *
   * Assert `value` is a boolean
   *
   *      var teaready = true
   *        , teaserved = false;
   *
   *      assert.isBoolean(tea_ready, 'is the tea ready');
   *      assert.isBoolean(tea_served, 'has tea been served');
   *
   * @name isBoolean
   * @param {*} value
   * @param {String} message
   * @api public
   */

  assert.isBoolean = function (val, msg) {
    new Assertion(val, msg).to.be.a('boolean');
  };

  /**
   * # .typeOf(value, name, [message])
   *
   * Assert typeof `value` is `name`.
   *
   *      assert.typeOf('tea', 'string', 'we have a string');
   *
   * @name typeOf
   * @param {*} value
   * @param {String} typeof name
   * @param {String} message
   * @api public
   */

  assert.typeOf = function (val, type, msg) {
    new Assertion(val, msg).to.be.a(type);
  };

  /**
   * # .instanceOf(object, constructor, [message])
   *
   * Assert `value` is instanceof `constructor`.
   *
   *      var Tea = function (name) { this.name = name; }
   *        , Chai = new Tea('chai');
   *
   *      assert.instanceOf(Chai, Tea, 'chai is an instance of tea');
   *
   * @name instanceOf
   * @param {Object} object
   * @param {Constructor} constructor
   * @param {String} message
   * @api public
   */

  assert.instanceOf = function (val, type, msg) {
    new Assertion(val, msg).to.be.instanceof(type);
  };

  /**
   * # .include(value, includes, [message])
   *
   * Assert the inclusion of an object in another. Works
   * for strings and arrays.
   *
   *      assert.include('foobar', 'bar', 'foobar contains string `var`);
   *      assert.include([ 1, 2, 3], 3, 'array contains value);
   *
   * @name include
   * @param {Array|String} value
   * @param {*} includes
   * @param {String} message
   * @api public
   */

  assert.include = function (exp, inc, msg) {
    var obj = new Assertion(exp, msg);

    if (Array.isArray(exp)) {
      obj.to.include(inc);
    } else if ('string' === typeof exp) {
      obj.to.contain.string(inc);
    }
  };

  /**
   * # .match(value, regex, [message])
   *
   * Assert that `value` matches regular expression.
   *
   *      assert.match('foobar', /^foo/, 'Regexp matches');
   *
   * @name match
   * @param {*} value
   * @param {RegExp} RegularExpression
   * @param {String} message
   * @api public
   */

  assert.match = function (exp, re, msg) {
    new Assertion(exp, msg).to.match(re);
  };

  /**
   * # .length(value, constructor, [message])
   *
   * Assert that object has expected length.
   *
   *      assert.length([1,2,3], 3, 'Array has length of 3');
   *      assert.length('foobar', 5, 'String has length of 6');
   *
   * @name length
   * @param {*} value
   * @param {Number} length
   * @param {String} message
   * @api public
   */

  assert.length = function (exp, len, msg) {
    new Assertion(exp, msg).to.have.length(len);
  };

  /**
   * # .throws(function, [constructor/regexp], [message])
   *
   * Assert that a function will throw a specific
   * type of error.
   *
   *      assert.throw(fn, ReferenceError, 'function throw reference error');
   *
   * @name throws
   * @alias throw
   * @param {Function} function to test
   * @param {ErrorConstructor} constructor
   * @param {String} message
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @api public
   */

  assert.throws = function (fn, type, msg) {
    if ('string' === typeof type) {
      msg = type;
      type = null;
    }

    new Assertion(fn, msg).to.throw(type);
  };

  /**
   * # .doesNotThrow(function, [constructor/regexp], [message])
   *
   * Assert that a function will throw a specific
   * type of error.
   *
   *      var fn = function (err) { if (err) throw Error(err) };
   *      assert.doesNotThrow(fn, Error, 'function throw reference error');
   *
   * @name doesNotThrow
   * @param {Function} function to test
   * @param {ErrorConstructor} constructor
   * @param {String} message
   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types
   * @api public
   */

  assert.doesNotThrow = function (fn, type, msg) {
    if ('string' === typeof type) {
      msg = type;
      type = null;
    }

    new Assertion(fn, msg).to.not.throw(type);
  };

  /**
   * # .operator(val, operator, val2, [message])
   *
   * Compare two values using operator.
   *
   *      assert.operator(1, '<', 2, 'everything is ok');
   *      assert.operator(1, '>', 2, 'this will fail');
   *
   * @name operator
   * @param {*} object to test
   * @param {String} operator
   * @param {*} second object
   * @param {String} message
   * @api public
   */

  assert.operator = function (val, operator, val2, msg) {
    if (!~['==', '===', '>', '>=', '<', '<=', '!=', '!=='].indexOf(operator)) {
      throw new Error('Invalid operator "' + operator + '"');
    }
    var test = new Assertion(eval(val + operator + val2), msg);
    test.assert(
        true === test.obj
      , 'expected ' + inspect(val) + ' to be ' + operator + ' ' + inspect(val2)
      , 'expected ' + inspect(val) + ' to not be ' + operator + ' ' + inspect(val2) );
  };

  /*!
   * Undocumented / untested
   */

  assert.ifError = function (val, msg) {
    new Assertion(val, msg).to.not.be.ok;
  };

  /*!
   * Aliases.
   */

  (function alias(name, as){
    assert[as] = assert[name];
    return alias;
  })
  ('length', 'lengthOf')
  ('throws', 'throw');
};

}); // module: interface/assert.js

require.register("interface/expect.js", function(module, exports, require){
/*!
 * chai
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = function (chai) {
  chai.expect = function (val, message) {
    return new chai.Assertion(val, message);
  };
};


}); // module: interface/expect.js

require.register("interface/should.js", function(module, exports, require){
/*!
 * chai
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports = function (chai) {
  var Assertion = chai.Assertion;

  chai.should = function () {
    // modify Object.prototype to have `should`
    Object.defineProperty(Object.prototype, 'should', {
      set: function(){},
      get: function(){
        if (this instanceof String || this instanceof Number) {
          return new Assertion(this.constructor(this));
        } else if (this instanceof Boolean) {
          return new Assertion(this == true);
        }
        return new Assertion(this);
      },
      configurable: true
    });

    var should = {};

    should.equal = function (val1, val2) {
      new Assertion(val1).to.equal(val2);
    };

    should.throw = function (fn, errt, errs) {
      new Assertion(fn).to.throw(errt, errs);
    };

    should.exist = function (val) {
      new Assertion(val).to.exist;
    }

    // negation
    should.not = {}

    should.not.equal = function (val1, val2) {
      new Assertion(val1).to.not.equal(val2);
    };

    should.not.throw = function (fn, errt, errs) {
      new Assertion(fn).to.not.throw(errt, errs);
    };

    should.not.exist = function (val) {
      new Assertion(val).to.not.exist;
    }

    return should;
  };
};

}); // module: interface/should.js

require.register("utils/eql.js", function(module, exports, require){
// This is directly from Node.js assert
// https://github.com/joyent/node/blob/f8c335d0caf47f16d31413f89aa28eda3878e3aa/lib/assert.js


module.exports = _deepEqual;

// For browser implementation
if (!Buffer) {
  var Buffer = {
    isBuffer: function () {
      return false;
    }
  };
}

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual === expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = Object.keys(a),
        kb = Object.keys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}
}); // module: utils/eql.js

require.register("utils/inspect.js", function(module, exports, require){
// This is (almost) directly from Node.js utils
// https://github.com/joyent/node/blob/f8c335d0caf47f16d31413f89aa28eda3878e3aa/lib/util.js

module.exports = inspect;

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Boolean} showHidden Flag that shows hidden (not enumerable)
 *    properties of objects.
 * @param {Number} depth Depth in which to descend in object. Default is 2.
 * @param {Boolean} colors Flag to turn on ANSI escape codes to color the
 *    output. Default is false (no coloring).
 */
function inspect(obj, showHidden, depth, colors) {
  var ctx = {
    showHidden: showHidden,
    seen: [],
    stylize: function (str) { return str; }
  };
  return formatValue(ctx, obj, (typeof depth === 'undefined' ? 2 : depth));
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (value && typeof value.inspect === 'function' &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    return value.inspect(recurseTimes);
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var visibleKeys = Object.keys(value);
  var keys = ctx.showHidden ? Object.getOwnPropertyNames(value) : visibleKeys;

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (typeof value === 'function') {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toUTCString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (typeof value === 'function') {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  switch (typeof value) {
    case 'undefined':
      return ctx.stylize('undefined', 'undefined');

    case 'string':
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                               .replace(/'/g, "\\'")
                                               .replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');

    case 'number':
      return ctx.stylize('' + value, 'number');

    case 'boolean':
      return ctx.stylize('' + value, 'boolean');
  }
  // For some reason typeof null is "object", so special case here.
  if (value === null) {
    return ctx.stylize('null', 'null');
  }
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (Object.prototype.hasOwnProperty.call(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str;
  if (value.__lookupGetter__) {
    if (value.__lookupGetter__(key)) {
      if (value.__lookupSetter__(key)) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else {
      if (value.__lookupSetter__(key)) {
        str = ctx.stylize('[Setter]', 'special');
      }
    }
  }
  if (visibleKeys.indexOf(key) < 0) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(value[key]) < 0) {
      if (recurseTimes === null) {
        str = formatValue(ctx, value[key], null);
      } else {
        str = formatValue(ctx, value[key], recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (typeof name === 'undefined') {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

function isArray(ar) {
  return Array.isArray(ar) ||
         (typeof ar === 'object' && objectToString(ar) === '[object Array]');
}

function isRegExp(re) {
  return typeof re === 'object' && objectToString(re) === '[object RegExp]';
}

function isDate(d) {
  return typeof d === 'object' && objectToString(d) === '[object Date]';
}

function isError(e) {
  return typeof e === 'object' && objectToString(e) === '[object Error]';
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
}); // module: utils/inspect.js


  return require('chai');
});


window.DesignIO = (function() {

  DesignIO.name = 'DesignIO';

  function DesignIO(namespace, options) {
    options || (options = {});
    this.callbacks = {};
    this.watchers = [];
    this.port = options.port || 4181;
    this.namespace = namespace;
    this.url = options.url || ("" + window.location.protocol + "//" + window.location.hostname + ":" + this.port);
    this.socket = io.connect(this.url);
    this.connect();
  }

  DesignIO.prototype.connect = function() {
    var self, socket;
    socket = this.socket;
    self = this;
    return socket.on('connect', function() {
      socket.emit('userAgent', self.userAgent());
      socket.on('watch', function(data) {
        return self.watch(data);
      });
      return socket.on('exec', function(data) {
        return self.exec(data);
      });
    });
  };

  DesignIO.prototype.on = function(name, callback) {
    return this.callbacks[name] = callback;
  };

  DesignIO.prototype.runCallback = function(name, data) {
    if (this.callbacks[name]) {
      this.callbacks[name].call(this, data);
    }
    return true;
  };

  DesignIO.prototype.watch = function(data) {
    var watcher, watchers, _i, _len, _results;
    this.watchers = watchers = JSON.parse(data, this.reviver).body;
    _results = [];
    for (_i = 0, _len = watchers.length; _i < _len; _i++) {
      watcher = watchers[_i];
      watcher.client = this;
      watcher.log = function(data) {
        data.path || (data.path = this.path);
        data.action || (data.action = this.action);
        data.timestamp || (data.timestamp = new Date);
        data.id = this.id;
        return this.client.log(data);
      };
      if (watcher.hasOwnProperty("connect")) {
        _results.push(watcher.connect());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  DesignIO.prototype.exec = function(data) {
    var watcher, watchers, _i, _len;
    data = JSON.parse(data, this.reviver);
    watchers = this.watchers;
    for (_i = 0, _len = watchers.length; _i < _len; _i++) {
      watcher = watchers[_i];
      if (watcher.id === data.id) {
        watcher.path = data.path;
        watcher.action = data.action;
        if (watcher.hasOwnProperty(data.action)) {
          watcher[data.action](data);
        }
      }
    }
    return this.runCallback(data.action, data);
  };

  DesignIO.prototype.log = function(data) {
    if (typeof data === "object") {
      data.userAgent = window.navigator.userAgent;
      data.url = window.location.href;
      data.namespace = this.namespace;
    }
    return this.socket.emit('log', JSON.stringify(data, this.replacer));
  };

  DesignIO.prototype.userAgent = function() {
    return {
      userAgent: window.navigator.userAgent,
      url: window.location.href,
      namespace: this.namespace
    };
  };

  DesignIO.prototype.replacer = function(key, value) {
    if (typeof value === "function") {
      return "(" + value + ")";
    } else {
      return value;
    }
  };

  DesignIO.prototype.reviver = function(key, value) {
    if (typeof value === "string" && !!value.match(/^(?:\(function\s*\([^\)]*\)\s*\{|\(\/)/) && !!value.match(/(?:\}\s*\)|\/\w*\))$/)) {
      return eval(value);
    } else {
      return value;
    }
  };

  return DesignIO;

})();



window.designer || (window.designer = new DesignIO("firstApp", {
  port: 4181
}));

mocha.setup('bdd');

global.assert = chai.assert;

global.expect = chai.expect;

global.test = it;

global.__flash_getWindowLocation = null;

global.__flash_getTopLocation = null;

$(function() {});


