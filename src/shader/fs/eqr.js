import { frag } from "../../gl/shader";

export default frag`
#version 300 es
precision mediump float;

in vec3 _position;

uniform sampler2D equirectangularMap;

out vec4 glcolor;

const vec2 invAtan = vec2(0.1591, 0.3183);

vec2 SampleSphericalMap(vec3 v) {
  vec2 uv = vec2(atan(v.z, v.x), asin(v.y));
  uv *= invAtan;
  uv += 0.5;
  return uv;
}

void main() {
  vec2 uv = SampleSphericalMap(normalize(_position));
  vec3 color = texture(equirectangularMap, uv).rgb;

  // vec3 mapped = color / (color + vec3(1.0));
  // // gamma correction
  // mapped = pow(mapped, vec3(1.0 / 1.5));

  glcolor = vec4(color, 1.0);
}
`