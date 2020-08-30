// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"components/uti.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Start = Start;
exports.stopInterval = exports.comeBackAt = exports.displayTime = exports.Timer = void 0;

var _index = require("../index");

var _handlers = require("./handlers");

let stopInterval; //function that takes seconds

exports.stopInterval = stopInterval;

const Timer = seconds => {
  const actualTime = Date.now();
  const then = actualTime + seconds * 1000;
  displayTime(seconds);
  comeBackAt(then); //Stop the Interval from running if it already was

  clearInterval(stopInterval);
  exports.stopInterval = stopInterval = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000); //stop Interval from running

    if (secondsLeft < 0) {
      clearInterval(stopInterval);
      return;
    } //play audio if seconds are less than 4


    if (secondsLeft < 4) {
      audio.play();
    } //display time left to the screen


    (0, _handlers.timeLeft)(secondsLeft);
    displayTime(secondsLeft);
    return secondsLeft;
  }, 1000);
}; //function to display time


exports.Timer = Timer;

const displayTime = seconds => {
  const minutesLeft = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  console.log(minutesLeft, secondsLeft);
  _index.timeOnScreen.style.opacity = 1;
  _index.timeOnScreen.textContent = "\n    ".concat(minutesLeft, " : ").concat(secondsLeft < 10 ? "0" : "").concat(secondsLeft);
}; //function to display when to come back


exports.displayTime = displayTime;

const comeBackAt = time => {
  const getBack = new Date(time);
  const hours = getBack.getHours();
  const minutes = getBack.getMinutes();
  _index.comeBackTime.style.opacity = 1;
  _index.comeBackTime.textContent = "Please come back at ".concat(hours, " : ").concat(minutes < 10 ? "0" : "").concat(minutes);
}; //function to start time


exports.comeBackAt = comeBackAt;

function Start(time) {
  const minutesToSeconds = time * 60;
  Timer(minutesToSeconds);
}
},{"../index":"index.js","./handlers":"components/handlers.js"}],"components/handlers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeLeft = timeLeft;
exports.playHandler = playHandler;
exports.pauseHandler = pauseHandler;
exports.stopHandler = stopHandler;

var _index = require("../index");

var _uti = require("./uti");

let timeInPause;

function timeLeft(time) {
  timeInPause = time;
} //Handlers


function playHandler() {
  const timeFromInput = parseInt(_index.input.value) * 60; //if timeInPause has already a value on it
  //we can resume the time in pause

  if (timeInPause) {
    (0, _uti.Timer)(timeInPause - 1);
  } //if timeInPause has not a value on it
  //Instead we are gonna take the value from the input


  if (timeFromInput > 0 && !timeInPause) {
    (0, _uti.Timer)(timeFromInput);
  }
}

function pauseHandler() {
  clearInterval(_uti.stopInterval);
  _index.comeBackTime.textContent = "Thanks";
  _index.comeBackTime.style.opacity = 0;
}

function stopHandler() {
  clearInterval(_uti.stopInterval);
  _index.timeOnScreen.textContent = "00:00";
  _index.comeBackTime.textContent = "Thanks";
  _index.comeBackTime.style.opacity = 0;
  timeInPause = "";
}
},{"../index":"index.js","./uti":"components/uti.js"}],"index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.input = exports.comeBackTime = exports.timeOnScreen = void 0;

var _handlers = require("./components/handlers");

var _uti = require("./components/uti");

const timeOnScreen = document.querySelector(".time");
exports.timeOnScreen = timeOnScreen;
const defaulTime = document.querySelectorAll("[data-time]");
const input = document.querySelector('[type="number"]');
exports.input = input;
const comeBackTime = document.querySelector(".come-back");
exports.comeBackTime = comeBackTime;
const play = document.querySelector(".play");
const pause = document.querySelector(".pause");
const stop = document.querySelector(".stop");
const audio = document.querySelector("audio");
const loco = 12; //Event Listeners

defaulTime.forEach(defTime => defTime.addEventListener("click", function () {
  const minutesDataset = parseInt(this.dataset.time);
  (0, _uti.Start)(minutesDataset);
}));
play.addEventListener("click", _handlers.playHandler);
pause.addEventListener("click", _handlers.pauseHandler);
stop.addEventListener("click", _handlers.stopHandler);
},{"./components/handlers":"components/handlers.js","./components/uti":"components/uti.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61313" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/minimalistTimer.e31bb0bc.js.map