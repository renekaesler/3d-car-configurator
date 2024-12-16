import Mat4 from "./gl/math/mat4";
import Wheel from "./wheel";

export default class Wheels {
  static async load(name) {
    const wheel = await Wheel.load(name);
    return new Wheels(wheel);
  }

  constructor(wheel) {
    this.wheel = wheel;
    this.transformations = [
      new Mat4(),
      new Mat4(),
      new Mat4(),
      new Mat4(),
    ];
  }

  destroy() {
    this.wheel.destroy();
  }

  arrange({ wheelBase, gauge }) {
    const halfWheelBase = wheelBase / 2;
    const halfGauge     = gauge / 2;
    const isDriverSide  = i => !(i % 2);
    const isFrontAxle   = i => i < 2;
    const y             = this.wheel.obb.max.y

    for(let i = 0; i < 4; ++i) {
      const x   = isFrontAxle(i)  ? -halfWheelBase :  halfWheelBase;
      const z   = isDriverSide(i) ?  halfGauge     : -halfGauge;
      const rad = isDriverSide(i) ?  0 : Math.PI;

      this.transformations[i]
        .identity()
        .translate(x, y, z)
        .rotateY(rad);
    }
  }

  render(context) {
    this.wheel.multiRender(context, this.transformations);
  }
}