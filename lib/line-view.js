var THREE = require('three');
module.exports = lineView;

function lineView(scene) {
  var api = {
    draw: draw
  };
  var geometry, edgeMesh;

  return api;

  function draw(lines) {
    var points = new Float32Array(lines);
    geometry = new THREE.BufferGeometry();

    var material = new THREE.LineBasicMaterial({
      //vertexColors: THREE.VertexColors
    });

    geometry.addAttribute('position', new THREE.BufferAttribute(points, 3));
    //geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    if (edgeMesh) {
      scene.remove(edgeMesh);
    }

    edgeMesh = new THREE.Line(geometry, material, THREE.LinePieces);
    edgeMesh.frustumCulled = false;
    scene.add(edgeMesh);
  }
}
