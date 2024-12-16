export default class Vec4 extends Float32Array {
  static normalize(a, out = new Vec4()) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        out[3] = a[3] * len;
    }
    return out;
  }

  constructor(x = 0, y = 0, z = 0, w = 0) {
    super([x, y, z, w]);
  }

  get x() { return this[0]; }
  get y() { return this[1]; }
  get z() { return this[2]; }

  set x(val) { this[0] = val; }
  set y(val) { this[1] = val; }
  set z(val) { this[2] = val; }

  set(x, y, z) { 
    this[0] = x;
    this[1] = y;
    this[2] = z;
  }

  normalize() {
    return Vec4.normalize(this,this);
  }
}