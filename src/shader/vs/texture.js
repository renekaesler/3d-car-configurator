import { vert } from "../../gl/shader"

export default vert`
  #version 300 es

  layout(location=0) in vec3 position;
  layout(location=2) in vec2 uv;

  uniform mat4 viewProjection;

  out vec3 _vertex;
  out vec2 _uv;

  void main() {
    _vertex = position;
    _uv = uv;

    gl_Position = viewProjection * vec4(position, 1.0);
  }
`