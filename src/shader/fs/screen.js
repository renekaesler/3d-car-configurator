import { frag } from "../../gl/shader";

export default frag`
#version 300 es
precision mediump float;

in vec2 _uv;

uniform sampler2D screenMap;

out vec4 glcolor;

void main() {
  glcolor = texture(screenMap, _uv);
}
`