import gl from './gl';
import Mat4 from './gl/math/mat4';

const identityMatrix = new Mat4();

export default class RenderList {
  constructor(models) {
    this.models = [];
    this.transparentModels = [];

    for(let model of models) {
      this.add(model);
    }

    this.sort();
  }

  destroy() {
    const models = this.models.concat(this.transparentModels);

    for(let j = 0, len = models.length; j < len; ++j) {
      const object = models[j];
      object.mesh.destroy();
    }
  }

  sort() {
    this.models.sort((a,b) => {
      const materialA = a.material.name;
      const materialB = b.material.name;

      if (materialA === materialB) return 0;

      return materialA < materialB ? -1 : 1;
    });
  }

  add(...models) {
    models.forEach(object => {
      const material = object.material;

      if (!material) return 0;

      this.needsResorting = true;

      if (material.isTransparent) {
        return this.transparentModels.push(object);
      } else {
        return this.models.push(object)
      }
    });
  }

  multiRender(ctx, transformations) {
    const objs = this.models;

    for(let j = 0, len = objs.length; j < len; ++j) {
      const object = objs[j];
      const material = object.material;
      const shader = material.shader;

      ctx.switchShader(shader);
      ctx.switchModelMatrix(this.modelMatrix || identityMatrix);
      ctx.switchMaterial(material);

      for(let i = 0; i < 4; ++i) {
        ctx.switchModelMatrix(transformations[i]);
        object.mesh.draw();
      }
    }
  }

  render(context) {
    this._render(context, this.models);
  }

  renderTransparent(context) {
    this._render(context, this.transparentModels);
  }

  _render(ctx, objs) {
    for(let j = 0, len = objs.length; j < len; ++j) {
      const object = objs[j];
      const material = object.material;
      const shader = material.shader;

      ctx.switchShader(shader);
      ctx.switchModelMatrix(this.modelMatrix || identityMatrix);
      ctx.switchMaterial(material);

      object.mesh.draw();
    }
  }
}