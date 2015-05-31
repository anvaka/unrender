var THREE = require('three');
var combineOptions = require('./options.js');
var createParticleView = require('./lib/particle-view.js');
var createHitTest = require('./lib/hit-test.js');
var flyControls = require('three.fly');

// Expose three.js as well, so simple clients do not have to require it
unrender.THREE = THREE;

module.exports = unrender;

function unrender(container, options) {
  var api = {
    destroy: destroy,
    scene: getScene,
    camera: getCamera,
    renderer: getRenderer,
    particles: particles,
    hitTest: getHitTest
  };

  options = combineOptions(options);
  var lastFrame;

  var scene = createScene();
  var camera = createCamera();
  var renderer = createRenderer();
  var particleView = createParticleView(scene);
  var input = createInputHandler();

  // TODO: This doesn't seem to belong here... Not sure where to put it
  var hitTest = createHitTest(particleView, container);

  startEventsListening();

  frame();

  return api;

  function getHitTest() {
    return hitTest;
  }

  function createInputHandler() {
    var controls = flyControls(camera, container, THREE);
    controls.movementSpeed = 200;
    controls.rollSpeed = 0.20;

    return controls;
  }

  function frame() {
    lastFrame = requestAnimationFrame(frame);
    renderer.render(scene, camera);
    hitTest.update(scene, camera);
    input.update(0.1);
  }

  function particles(coordinates) {
    if (coordinates === undefined) {
      return particleView.coordinates();
    }

    particleView.render(coordinates);

    return api;
  }

  function destroy() {
    hitTest.destroy();
    input.destroy();
    stopEventsListening();
    container.removeChild(renderer.domElement);
  }

  function createScene() {
    var scene = new THREE.Scene();
    scene.sortObjects = false;
    return scene;
  }

  function getScene() {
    return scene;
  }

  function createCamera() {
    var camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 20000);
    scene.add(camera);

    return camera;
  }

  function getCamera() {
    return camera;
  }

  function createRenderer() {
    var renderer = new THREE.WebGLRenderer({
      antialias: false
    });

    renderer.setClearColor(options.clearColor, 1);
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);
    return renderer;
  }

  function getRenderer() {
    return renderer;
  }

  function startEventsListening() {
    window.addEventListener('resize', onWindowResize, false);
    hitTest.on('highlight', particleView.highlight);

    //hitTest.on('rendertree', renderTree);
  }

  function renderTree(tree) {
    var treeGeometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors
    });
    var octs = createOcts(tree);

    var points = new Float32Array(octs);
    var colors = createColors(points.length);

    treeGeometry.addAttribute('position', new THREE.BufferAttribute(points, 3));
    treeGeometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    var edgeMesh = new THREE.Line(treeGeometry, material, THREE.LinePieces);
    edgeMesh.frustumCulled = false;
    scene.add(edgeMesh);
  }

  function createOcts(tree) {
    var points = [];
    var root = tree.getRoot();
    addNode(points, root);
    return points;
  }

  function addNode(points, node) {
    if (!node) return;
    addBounds(points, node.bounds);
    addNode(points, node.q0);
    addNode(points, node.q1);
    addNode(points, node.q2);
    addNode(points, node.q3);
    addNode(points, node.q4);
    addNode(points, node.q5);
    addNode(points, node.q6);
    addNode(points, node.q7);
  }

  function createColors(length) {
    var arr = new Float32Array(length);
    for (var i = 0; i < length; ++i) {
      arr[i] = 0.5;
    }
    return arr;
  }

  function addBounds(to, bounds) {
    var left = bounds.x - bounds.half;
    var right = bounds.x + bounds.half;
    var top = bounds.y - bounds.half;
    var bottom = bounds.y + bounds.half;
    var back = bounds.z - bounds.half;
    var front = bounds.z + bounds.half;

    // front
    to.push(left, top, front,
            right, top, front,

            right, top, front,
            right, bottom, front,

            right, bottom, front,
            left, bottom, front,

            left, bottom, front,
            left, top, front);

    // back:
    to.push(left, top, back,
            right, top, back,

            right, top, back,
            right, bottom, back,

            right, bottom, back,
            left, bottom, back,

            left, bottom, back,
            left, top, back);

    // bottom
    to.push(left, bottom, back,
            left, bottom, front,

            right, bottom, back,
            right, bottom, front
            );
    // top
    to.push(left, top, back,
            left, top, front,

            right, top, back,
            right, top, front
            );
  }

  function stopEventsListening() {
    window.removeEventListener('resize', onWindowResize, false);
    cancelAnimationFrame(lastFrame);
  }

  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
}
