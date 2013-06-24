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