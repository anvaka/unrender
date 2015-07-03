module.exports = [
'attribute float size;',
'attribute vec4 customColor;',
'',
'varying vec4 vColor;',
'',
'void main() {',
'  vColor = vec4(customColor.rgb/255.0, customColor.a);',
'  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
'  gl_PointSize = size * ( 351.0 / length( mvPosition.xyz ) );',
'  gl_Position = projectionMatrix * mvPosition;',
'}'
].join('\n');
