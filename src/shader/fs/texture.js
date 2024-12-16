import { frag } from "../../gl/shader";

export default frag`
#version 300 es
precision mediump float;

in vec3 _vertex;
in vec2 _uv;

uniform bool isTransparent;
uniform sampler2D albedoMap;
uniform sampler2D shadowMap;

out vec4 glcolor;

void main() {
  vec3 color;
  vec2 shadowCoord = (_vertex.zx / 14.0) + vec2(0.5);
  vec3  albedo = texture(albedoMap, _uv).rgb;
  float shadow = texture(shadowMap, shadowCoord).r;
  float alpha = 1.0;

  if (isTransparent) {
    alpha = 1.0 - shadow;
  } else {
    color = albedo * shadow;
  }

  glcolor = vec4(color, alpha);
}
`