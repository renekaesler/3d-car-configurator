import Vec3 from "./gl/math/vec3";

export default class Obb3 {
  constructor() {
    this.min = new Vec3();
    this.max = new Vec3();
  }

  surround(point) {
    for(let i = 0; i < 3; ++i) {
      const coord = point[i];

      if (coord < this.min[i]) this.min[i] = coord;
      if (coord > this.max[i]) this.max[i] = coord;
    }
  }
}