module.exports = [
'uniform vec3 color;',
'uniform sampler2D texture;',
'',
'varying vec3 vColor;',
'',
'void main() {',
'  vec4 tColor = texture2D( texture, gl_PointCoord );',
'  if (tColor.a < 0.9) discard;',
'  gl_FragColor = vec4( color * vColor, 1.0 );',
'  gl_FragColor = vec4(gl_FragColor.rgb, tColor.a);',
'}'
].join('\n');
