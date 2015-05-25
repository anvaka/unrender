var THREE = require('three');
var particleMaterial = require('./particle-material.js')();

module.exports = particleView;

function particleView(scene) {
  var points, colors, sizes;
  var particleSystem, geometry;

  var api = {
    coordinates: getPoints,
    render: render
  };

  return api;

  function render(newPoints, newColors, newSizes) {
    setPoints(newPoints);
    // TODO: how clients should customize this? I don't like this API!
    setColors(newColors);
    setSizes(newSizes);

    geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(points, 3));
    geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

    if (particleSystem) {
      scene.remove(particleSystem);
    }

    particleSystem = new THREE.PointCloud(geometry, particleMaterial);
    scene.add(particleSystem);
  }

  function setColors() {
    // TODO: if they are uniform we can save memory
    colors = new Float32Array(points.length);
    for (var i = 0; i < points.length; ++i) {
      colors[i] = 0xff;
    }
  }

  function setSizes() {
    sizes = new Float32Array(points.length/3);
    for (var i = 0; i < sizes.length; ++i) {
      sizes[i] = 15;
    }
  }

  function setPoints(newPoints) {
    if (isFloat32Array(newPoints)) {
      points = newPoints;
    } else {
      // todo: error checking
      points = new Float32Array(newPoints);
    }
    if (points.length > 0 && (points.length % 3) !== 0) {
      throw new Error('Each particle is expected to have three coordinates');
    }
  }

  function getPoints() {
    return points;
  }

  function isFloat32Array(obj) {
    return Object.prototype.toString.call(obj) === "[object Float32Array]";
  }
}
