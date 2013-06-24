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
