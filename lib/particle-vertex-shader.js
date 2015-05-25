module.exports = [
'attribute float size;',
'attribute vec3 customColor;',
'',
'varying vec3 vColor;',
'',
'void main() {',
'  vColor = customColor / 255.0;',
'  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
// todo: this needs to be rethought:
'  gl_PointSize = size * ( 500.0 / length( mvPosition.xyz ) );',
'  gl_Position = projectionMatrix * mvPosition;',
'}'
].join('\n');
