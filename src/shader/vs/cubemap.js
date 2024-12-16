import { vert } from "../../gl/shader"

export default vert`
  #version 300 es
  layout(location=0) in vec3 position;

  uniform mat4 projection;
  uniform mat4 view;

  out vec3 _position;

  void main() {
    _position = position;
    gl_Position =  projection * view * vec4(_position, 1.0);
  }
`