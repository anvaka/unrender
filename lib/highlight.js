/**
 * Represents indepenet set of particles which are rendered as
 * highlighted on the scene.
 */
var THREE = require('three');
var instanceId = 0;
var normalizeColor = require('./normalize-color.js');

module.exports = createHighlight;

function createHighlight(scene, particleView) {
  var highlihgtMaterial = require('./particle-material.js')();
  var highlightParticles, highlightGeometry;

  var currentId = ++instanceId;

  var api = {
    show: show,
    clear: clear,
    getId: getId
  }

  return api;

  function getId() {
    return currentId;
  }

  function clear() {
    if (highlightParticles) {
      scene.remove(highlightParticles);
    }
  }

  function show(indexes, color, scale) {
    var i;
    clear();
    if (!indexes) return;

    color = normalizeColor(color);
    if (!color) color = 0xff0000;
    if (typeof scale !== 'number') scale = 1;

    var points = particleView.coordinates();
    var sizes = particleView.sizes();

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
}
