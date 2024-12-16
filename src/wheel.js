import RenderList from "./renderlist";
import Obj from './loader/obj';
import PbrMaterial from './material/pbr-material';
import createFromObj from './mesh/obj';
import Obb3 from "./obb3";

export default class Wheel extends RenderList {
  static async load(name) {
    const url = `wheels/${name}`;

    const [model, materials] = await Promise.all([
      Obj.fetch(`${url}/model.obj`),
      PbrMaterial.fetch(`${url}/material.json`),
    ]);

    const models = createFromObj(model).map(([mesh, materialName]) => {
      const material = materials[materialName];
      return { mesh, material };
    });

    return new Wheel(models);
  }

  get materials() {
    const materials = [];

    for(let i = 0, len = this.models.length; i < len; ++i) {
      const model = this.models[i];
      materials.push(model.material);
    }

    return materials;
  }

  constructor(models) {
    super(models);

    this.obb = new Obb3();

    for(let i = 0, len = models.length; i < len; ++i) {
      const obb = models[i].mesh.obb;

      this.obb.surround(obb.min);
      this.obb.surround(obb.max);
    }
  }
}