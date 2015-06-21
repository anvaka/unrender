var THREE = require('three');

module.exports = particleView;

function particleView(scene) {
  var points, colors, sizes;
  var particleSystem, geometry;
  var particleMaterial = require('./particle-material.js')();
  var highlihgtMaterial = require('./particle-material.js')();
  var highlightParticles, highlightGeometry;

  var api = {
    coordinates: getPoints,
    render: render,
    particles: getParticles,
    highlight: highlight
  };

  return api;

  function getParticles() {
    return particleSystem;
  }

  function highlight(indexes, color, scale) {
    var i;
    if (highlightParticles) {
      scene.remove(highlightParticles);
    }
    if (!indexes) return;

    var hpoints = new Float32Array(indexes.length * 3);
    var hcolors = new Float32Array(indexes.length * 3);
    var hsizes = new Float32Array(indexes.length);
    var r = (color & 0xff0000) >> 16;
    var g = (color & 0x00ff00) >> 8;
    var b = (color & 0x0000ff);

    for (i = 0; i < indexes.length; ++i) {
      var idx = indexes[i];
      var i3 = i * 3;
      hcolors[i3] = r;
      hcolors[i3 + 1] = g;
      hcolors[i3 + 2] = b;
      hpoints[i3] = points[idx];
      hpoints[i3 + 1] = points[idx + 1];
      hpoints[i3 + 2] = points[idx + 2];
      hsizes[i] = sizes[idx/3] * scale;
    }

    highlightGeometry = new THREE.BufferGeometry();
    highlightGeometry.addAttribute('position', new THREE.BufferAttribute(hpoints, 3));
    highlightGeometry.addAttribute('customColor', new THREE.BufferAttribute(hcolors, 3));
    highlightGeometry.addAttribute('size', new THREE.BufferAttribute(hsizes, 1));

    highlightParticles = new THREE.PointCloud(highlightGeometry, highlihgtMaterial);
    scene.add(highlightParticles);
  }

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
    for (var i = 0; i < points.length; i += 3) {
      colors[i] = 0xff;
      colors[i + 1] = 0xff;
      colors[i + 2] = 0xff;
    }
  }

  function setSizes() {
    sizes = new Float32Array(points.length / 3);
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
