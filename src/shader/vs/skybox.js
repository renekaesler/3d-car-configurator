import { vert } from "../../gl/shader"

export default vert`
  #version 300 es

  layout(location=0) in vec3 position;

  uniform mat4 viewProjection;

  out vec3 _vertex;

  void main() {
    _vertex = position;
    vec4 pos =  viewProjection * vec4(position, 1.0);
    gl_Position = pos.xyww;
  }
`