import gl from '../gl';

import shader from '../shader/texture-shader';
import Vec4 from '../gl/math/vec4';
import Material from './index.js';

export default class BasicMaterial extends Material {
  static async fetch(url) {
    const materials = await Material.fetch(url);

    for(let name in materials) {
      const material = materials[name];
      materials[name] = new BasicMaterial(material);
    }

    return materials;
  }

  constructor({
    name = 'UNKNOWN',
    albedo = new Vec4(0.0, 0.0, 0.0, 1.0),
    isTransparent = false
  } = {}) {
    super({ name, isTransparent });

    this.albedoMap    = Material.createMap(albedo, gl.RGB);
  }

  get shader() {
    return shader;
  }

  use(context) {
    shader.isTransparent = this.isTransparent;

    shader.albedoMap = this.albedoMap.active(0);
    shader.shadowMap = context.shadowPlane.active(1);

    return this;
  }
}