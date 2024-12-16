export default class RenderContext {
  constructor({ scene, camera } = {}) {
    this.camera = camera;
    this.scene = scene;
  }

  clear() {
    delete this.shader;
    delete this.material;
  }

  switchMaterial(material) {
    if (this.material && this.material.name === material.name) return;
    this.material = material.use(this);
  }

  switchShader(shader) {
    if (this.shader === shader) return;
    const camera = this.camera;

    shader.use();
    shader.viewProjection = camera.viewProjection;
    shader.camPos     = camera.position;

    this.shader = shader;
  }

  switchModelMatrix(model) {
    if(this.modelMatrix === model) return;

    this.modelMatrix  = model;
    this.shader.model = model;
  }
}