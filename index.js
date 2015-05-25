var THREE = require('three');
var combineOptions = require('./options.js');
var createParticleView = require('./lib/particle-view.js');
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
    particles: particles
  };

  options = combineOptions(options);
  var lastFrame;

  var scene = createScene();
  var camera = createCamera();
  var renderer = createRenderer();
  var particleView = createParticleView(scene);
  var input = createInputHandler();

  startEventsListening();

  frame();

  return api;

  function createInputHandler() {
    var controls = flyControls(camera, container, THREE);
    controls.movementSpeed = 200;
    controls.rollSpeed = 0.20;

    return controls;
  }

  function frame() {
    lastFrame = requestAnimationFrame(frame);
    renderer.render(scene, camera);
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
    // todo: implement me:
    // * remove renderer child
    stopEventsListening();
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
    var camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 2000);
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
