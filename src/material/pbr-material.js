import gl from '../gl';

import shader from '../shader/pbr-shader';
import Vec4 from '../gl/math/vec4';
import Material from './index.js';
import Texture2D from '../gl/texture-2d';

export default class PbrMaterial extends Material {
  static async fetch(url) {
    const materials = await Material.fetch(url);

    for(let name in materials) {
      const material = materials[name];
      materials[name] = new PbrMaterial(material);
    }

    return materials;
  }
  constructor({
    name = 'UNKNOWN',
    albedo = new Vec4(0.0, 0.0, 0.0, 1.0),
    normal = false,
    metallic = 0.0,
    roughness = 1.0,
    occlusion = 1.0,
    isTransparent = false
  } = {}) {
    super({ name, isTransparent });

    this.useNormalMap = !!normal;

    this.albedoMap    = Material.createMap(albedo, gl.RGB);
    this.normalMap    = Material.createMap(normal || [1, 0, 1], gl.RGB);
    this.metallicMap  = Material.createMap(metallic, gl.R8);
    this.roughnessMap = Material.createMap(roughness, gl.R8);
    this.occlusionMap = Material.createMap(occlusion, gl.R8);
  }

  get shader() {
    return shader;
  }

  get albedo() {
    return this.albedoMap.value;
  }

  get metallic() {
    return this.metallicMap.value;
  }

  get roughness() {
    return this.roughnessMap.value;
  }

  get occlusion() {
    return this.occlusionMap.value;
  }

  set albedo(color) {
    Texture2D.fromValue(color, this.albedoMap);
  }

  set metallic(value) {
    Texture2D.fromValue(value, this.metallicMap);
  }

  set roughness(value) {
    Texture2D.fromValue(value, this.roughnessMap);
  }

  set occlusion(value) {
    Texture2D.fromValue(value, this.occlusionMap);
  }

  use(context) {
    shader.useNormalMap   = this.useNormalMap;
    shader.isTransparent  = this.isTransparent;

    shader.albedoMap    = this.albedoMap.active(0);
    shader.normalMap    = this.normalMap.active(1);
    shader.metallicMap  = this.metallicMap.active(2);
    shader.roughnessMap = this.roughnessMap.active(3);
    shader.occlusionMap = this.occlusionMap.active(4);

    const env = context.scene.environment;

    if(this.environment !== context.scene.environment) {
      this.environment = context.scene.environment;
      shader.irradianceMap  = env.irradiance.active(5);
      shader.prefilterMap   = env.radiance.active(6);
      shader.brdfLUT        = env.brdf.active(7);
    }

    return this;
  }
}