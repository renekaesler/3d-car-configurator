import { vert } from "../../gl/shader"

export default vert`
  #version 300 es

  layout(location=0) in vec3 position;
  layout(location=1) in vec3 normal;
  layout(location=2) in vec2 uv;

  out vec2 TexCoords;
  out vec3 WorldPos;
  out vec3 Normal;

  uniform mat4 viewProjection;
  uniform mat4 model;

  void main()
  {
    TexCoords = uv;
    WorldPos = vec3(model * vec4(position, 1.0));
    Normal = mat3(model) * normal;

    gl_Position =  viewProjection * vec4(WorldPos, 1.0);
  }
`

