var raf = require('raf')
var canvas = document.createElement('canvas')
  , context = canvas.getContext( '2d' )

canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)

var size = Math.min(canvas.width, canvas.height) * 0.7

var layer_count = 240
  , overlap = Math.round(layer_count * 0.3) // the number of layers to overlap 30%
  , layers = []
  , layersize = size * 0.3
  , cycle = 0

for (var i = layer_count - 1; i >= 0; i--) {
  layers.push({
    x: get_circle_x(canvas.width, i, layer_count),
    y: get_circle_y(canvas.height, i, layer_count),
    // x: get_diamond_x(canvas.width, i, layer_count),
    // y: get_diamond_y(canvas.height, i, layer_count),
    r: get_rotation(i),
    // color: i === 0 ? "#000" : get_color(i),
    color: get_color(i),
    strokewidth: Math.random()+0.7
  })
}

console.log(layers)

raf(canvas).on('data', draw)


function draw() {
  update()
  clear()
  draw_layers(-overlap)
  draw_layer(layers[0], true)
  draw_layers()
}

function update() {
  layers.map(function(layer, i) {
    layer.r = get_rotation(i+cycle)
    // layer.color = get_color(i-cycle)
  })
  cycle = cycle + 0.2
  if (cycle > layers.length*3) {
    cycle = 0
  }
}

function draw_layers(limit) {
  var start = 0
  limit = limit || layers.length
  if (limit < 0) {
    start = layers.length + limit
  }
  for( var i = start, len = layers.length; i < len; i++ ) {
    if (limit > 0 && i > limit) {
      return
    }
    draw_layer(layers[i])
  }
}

function clear() {
  context.clearRect( 0, 0, canvas.width, canvas.height );
}

function draw_layer(layer, mask) {
  var opperation = 'destination-over'
  if (mask) {
    opperation = "destination-in"
  }
  context.save()
  context.globalCompositeOperation = opperation

  context.translate(layer.x, layer.y)
  context.rotate(layer.r)
  if (mask) {
    draw_square(layersize + 200, layer.color)
  } else {
    draw_square(layersize, layer.color, "#111", layer.strokewidth)
  }

  context.restore()
}

function draw_square(size, fill, strokecolor, strokewidth) {
  fill = fill || "#fff"
  context.opacity = 0.8
  if (strokewidth && strokecolor) {
    context.strokeStyle = '#000';
    context.lineWidth = strokewidth
    context.strokeRect( -size/2, -size/2, size, size );
  }
  context.fillStyle = fill
  context.fillRect( -size/2, -size/2, size, size );
}

function get_rotation(i) {
  return ( i / 0.33333333 / layer_count ) * Math.PI
}

function get_color(i) {
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

function get_circle_x(width, i, steps) {
  return width/2 + Math.sin( i / steps * 2 * Math.PI ) * ( size/2.5 ) + Math.random()*4-1
}

function get_circle_y(height, i, steps) {
  return height/2 + Math.cos( i / steps * 2 * Math.PI ) * ( size/2.5 ) + Math.random()*4-1
}

function get_diamond_x(width, i, steps) {
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

  return center + (x * size*0.008) + Math.random()*4-1
}

function get_diamond_y(height, i, steps) {
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

  return layersize/2 + (x * size*0.008) + Math.random()*4-1
}
function get_triangle_y(height, i, steps) {
  return height/2 + Math.cos( i / steps * 2 * Math.PI ) * ( size/2.5 ) + Math.random()*4-1
}