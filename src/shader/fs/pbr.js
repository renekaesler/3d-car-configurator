import { frag } from "../../gl/shader";

import constants from '../glsl/constants';
import geometrySmith from '../glsl/geometrySmith';
import methods from '../glsl/methods';

export default frag`
#version 300 es
precision mediump float;

${constants}
${methods}
${geometrySmith}

out vec4 FragColor;
in vec2 TexCoords;
in vec3 WorldPos;
in vec3 Normal;

// material parameters
uniform sampler2D albedoMap;
uniform sampler2D normalMap;
uniform sampler2D metallicMap;
uniform sampler2D roughnessMap;
uniform sampler2D occlusionMap;

uniform bool useNormalMap;
uniform bool isTransparent;

// IBL
uniform samplerCube irradianceMap;
uniform samplerCube prefilterMap;
uniform sampler2D brdfLUT;

// lights
uniform vec3 lightPositions[1];
uniform vec3 lightColors[1];

uniform vec3 camPos;

// ----------------------------------------------------------------------------
// Easy trick to get tangent-normals to world-space to keep PBR code simplified.
// Don't worry if you don't get what's going on; you generally want to do normal
// mapping the usual way for performance anways; I do plan make a note of this
// technique somewhere later in the normal mapping tutorial.
vec3 getNormalFromMap() {
  vec3 tangentNormal = texture(normalMap, TexCoords).xyz * 2.0 - 1.0;

  vec3 Q1  = dFdx(WorldPos);
  vec3 Q2  = dFdy(WorldPos);
  vec2 st1 = dFdx(TexCoords);
  vec2 st2 = dFdy(TexCoords);

  vec3 N   = normalize(Normal);
  vec3 T  = normalize(Q1*st2.t - Q2*st1.t);
  vec3 B  = -normalize(cross(N, T));
  mat3 TBN = mat3(T, B, N);

  return normalize(TBN * tangentNormal);
}

// ----------------------------------------------------------------------------
void main() {
  vec4 albedoColor  = texture(albedoMap, TexCoords);
  float metallic    = texture(metallicMap, TexCoords).r;
  float roughness   = texture(roughnessMap, TexCoords).r;
  float ao          = texture(occlusionMap, TexCoords).r;
  vec3 albedo       = pow(albedoColor.rgb, vec3(2.2));
  float alpha       = albedoColor.a;


  vec3 N = useNormalMap ? getNormalFromMap() : Normal;
  vec3 V = normalize(camPos - WorldPos);
  vec3 R = reflect(-V, N);

  // calculate reflectance at normal incidence; if dia-electric (like plastic) use F0
  // of 0.04 and if it's a metal, use the albedo color as F0 (metallic workflow)
  vec3 F0 = vec3(0.04);
  F0 = mix(F0, albedo, metallic);

  // ambient lighting (note that the next IBL tutorial will replace
  // this ambient lighting with environment lighting).
  vec3 F = fresnelSchlickRoughness(max(dot(N, V), 0.0), F0, roughness);

  vec3 kS = F;
  vec3 kD = 1.0 - kS;
  kD *= 1.0 - metallic;

  vec3 irradiance = texture(irradianceMap, N).rgb;
  vec3 diffuse      = irradiance * albedo;

  // sample both the pre-filter map and the BRDF lut and combine them together as per the Split-Sum approximation to get the IBL specular part.
  const float MAX_REFLECTION_LOD = 7.0;
  vec3 prefilteredColor = textureLod(prefilterMap, R,  roughness * MAX_REFLECTION_LOD).rgb;

  vec2 brdf  = texture(brdfLUT, vec2(max(dot(N, V), 0.0), roughness)).rg;
  vec3 specular = prefilteredColor * (F * brdf.x + brdf.y);

  vec3 ambient = (kD * diffuse + specular) * ao;

  vec3 color = ambient;

  // HDR tonemapping
  color = color / (color + vec3(1.0));
  // color = vec3(1.0) - exp(-color * 3.0);
  // gamma correct
  color = pow(color, vec3(1.0 / 2.2));

  FragColor = vec4(color, alpha);
}
`