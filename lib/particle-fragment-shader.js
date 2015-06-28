module.exports = [
'uniform vec3 color;',
'uniform sampler2D texture;',
'',
'varying vec3 vColor;',
'',
'void main() {',
'  vec4 tColor = texture2D( texture, gl_PointCoord );',
'  if (tColor.a < 0.5) discard;',
'  gl_FragColor = vec4( color * vColor, tColor.a );',
'}'
].join('\n');
