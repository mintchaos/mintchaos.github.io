;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var labs = {}
labs.SpinningCircle = require('./spinningcircle')
labs.SpinningDiamond = require('./spinningdiamond')

window.labs = labs
},{"./spinningcircle":2,"./spinningdiamond":3}],3:[function(require,module,exports){
var SpinningCircle = require('./spinningcircle')

function SpinningDiamond() {}

SpinningDiamond.prototype = new SpinningCircle()
var proto = SpinningDiamond.prototype

proto.get_x = function(width, i, steps) {
  console.log(i, steps)
  var center = width/2
    , back = i < steps/2
    , x

    if (i < steps/4) {
      x = -i
    } else {
      x = i - steps/4*2
    }

    if (i > steps/4*3) {
      x = steps - i
    }

  // i/steps + (steps - ) //*

  return center + (x * this.size*0.008) + Math.random()*4-1
}

proto.get_y = function(height, i, steps) {
  console.log(i, steps)
  var center = height/2
    , back = i < steps/2
    , x

    if (i < steps/2) {
      x = i
    } else {
      x = i - (i - steps/2)*2
    }

  // i/steps + (steps - ) //*

  return this.layersize*0.7 + (x * this.size*0.008) + Math.random()*4-1
}


module.exports = SpinningDiamond

},{"./spinningcircle":2}],2:[function(require,module,exports){
var raf = require('raf')

module.exports = SpinningCircle

function SpinningCircle() {}

var proto = SpinningCircle.prototype

proto.init = function(canvas, layer_count) {
  this.canvas = canvas
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  this.context = canvas.getContext( '2d' )
  this.size = Math.min(canvas.width, canvas.height) * 0.7
  this.layer_count = 260
  this.overlap = Math.round(this.layer_count * 0.3) // the number of layers to overlap 30%
  this.layers = []
  this.layersize = this.size * 0.3
  this.cycle = 0

  this.reset()

  var spinner = this
  // window.addEventListener('resize', function(){spinner.reset()})
  raf(this.canvas).on('data', function() {spinner.draw()})
}

proto.reset = function() {
  for (var i = this.layer_count - 1; i >= 0; i--) {
    this.layers.push({
      x: this.get_x(this.canvas.width, i, this.layer_count),
      y: this.get_y(this.canvas.height, i, this.layer_count),
      // x: this.get_diamond_x(this.canvas.width, i, this.layer_count),
      // y: this.get_diamond_y(this.canvas.height, i, this.layer_count),
      r: this.get_rotation(i),
      // color: i === 0 ? "#000" : get_color(i),
      color: this.get_color(i),
      strokewidth: Math.random()+0.7
    })
  }
}

proto.draw = function() {
  this.update()
  this.clear()
  this.draw_layers(-this.overlap)
  this.draw_layer(this.layers[0], true)
  this.draw_layers()
}

proto.update = function() {
  for (var i = this.layers.length - 1; i >= 0; i--) {
    this.layers[i].r = this.get_rotation(i+this.cycle)
  }
  this.cycle = this.cycle + 0.2
  if (this.cycle > this.layers.length*3) {
    this.cycle = 0
  }
}

proto.draw_layers = function(limit) {
  var start = 0
  limit = limit || this.layers.length
  if (limit < 0) {
    start = this.layers.length + limit
  }
  for( var i = start, len = this.layers.length; i < len; i++ ) {
    if (limit > 0 && i > limit) {
      return
    }
    this.draw_layer(this.layers[i])
  }
}

proto.clear = function() {
  this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
}

proto.draw_layer = function(layer, mask) {
  var opperation = 'destination-over'
  if (mask) {
    opperation = "destination-in"
  }
  this.context.save()
  this.context.globalCompositeOperation = opperation

  this.context.translate(layer.x, layer.y)
  this.context.rotate(layer.r)
  if (mask) {
    this.draw_square(this.layersize + 200, layer.color)
  } else {
    this.draw_square(this.layersize, layer.color, "#111", layer.strokewidth)
  }

  this.context.restore()
}

proto.draw_square = function(size, fill, strokecolor, strokewidth) {
  fill = fill || "#fff"
  this.context.opacity = 0.8
  if (strokewidth && strokecolor) {
    this.context.strokeStyle = '#000';
    this.context.lineWidth = strokewidth
    this.context.strokeRect( -size/2, -size/2, size, size );
  }
  this.context.fillStyle = fill
  this.context.fillRect( -size/2, -size/2, size, size );
}

proto.get_rotation = function(i) {
  return ( i / 0.33333333 / this.layer_count ) * Math.PI
}

proto.get_color = function(i) {
  var colors = [
    "#fafafa",
    "#f2f2f2",
    "#eaeaea",
    "#e2e2e2",
    "#dadada",
    "#cacaca",
  ]
  return colors[Math.abs(i % colors.length)]
}

proto.get_x = function(width, i, steps) {
  return width/2 + Math.sin( i / steps * 2 * Math.PI ) * ( this.size/2.5 ) + Math.random()*4-1
}

proto.get_y = function(height, i, steps) {
  return height/2 + Math.cos( i / steps * 2 * Math.PI ) * ( this.size/2.5 ) + Math.random()*4-1
}

function get_triangle_y(height, i, steps) {
  return height/2 + Math.cos( i / steps * 2 * Math.PI ) * ( this.size/2.5 ) + Math.random()*4-1
}
},{"raf":4}],4:[function(require,module,exports){
(function(){module.exports = raf

var EE = require('events').EventEmitter
  , global = typeof window === 'undefined' ? this : window
  , now = global.performance && global.performance.now ? function() {
    return performance.now()
  } : Date.now || function () {
    return +new Date()
  }

var _raf =
  global.requestAnimationFrame ||
  global.webkitRequestAnimationFrame ||
  global.mozRequestAnimationFrame ||
  global.msRequestAnimationFrame ||
  global.oRequestAnimationFrame ||
  (global.setImmediate ? function(fn, el) {
    setImmediate(fn)
  } :
  function(fn, el) {
    setTimeout(fn, 0)
  })

function raf(el) {
  var now = raf.now()
    , ee = new EE

  ee.pause = function() { ee.paused = true }
  ee.resume = function() { ee.paused = false }

  _raf(iter, el)

  return ee

  function iter(timestamp) {
    var _now = raf.now()
      , dt = _now - now
    
    now = _now

    ee.emit('data', dt)

    if(!ee.paused) {
      _raf(iter, el)
    }
  }
}

raf.polyfill = _raf
raf.now = now


})()
},{"events":5}],6:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],5:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":6}]},{},[1,2,3])
;