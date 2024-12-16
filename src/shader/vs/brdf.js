import { vert } from "../../gl/shader"

export default vert`
  #version 300 es
  layout(location=0) in vec3 position;
  layout(location=2) in vec2 uv;

  out vec2 _uv;

  void main() {
    _uv = uv;
    gl_Position =  vec4(position, 1.0);
  }
`