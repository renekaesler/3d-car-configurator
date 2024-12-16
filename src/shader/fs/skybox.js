import { frag } from "../../gl/shader";

export default frag`
#version 300 es
precision mediump float;

in vec3 _vertex;

uniform samplerCube txtr;

out vec4 glcolor;

void main() {
  vec3 color = texture(txtr, _vertex).rgb;

  // // HDR tonemapping
  // color = color / (color + vec3(1.0));
  // // gamma correct
  // color = pow(color, vec3(1.0/2.2));

  glcolor = vec4(color, 1.0);
}
`